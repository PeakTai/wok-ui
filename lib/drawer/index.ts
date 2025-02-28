// 抽屉
import { ANIMATION_PROVISION, Animation, animate } from '../animation'
import { showWarning } from '../message'
import { DivModule, SubModulesOpt, buildSubModules } from '../module'
import './style.less'

export interface DrawerOpts {
  /**
   * 位置，默认是 right．
   */
  placement?: 'left' | 'right' | 'top' | 'bottom'
  /**
   * 标题.
   */
  title?: string
  /**
   * 内容.
   */
  body: SubModulesOpt
  /**
   * 使用 body 部分替换掉整个内容.适用于高度自定义的场景.
   */
  replaceByBody?: boolean
  /**
   * 关闭事件回调
   */
  onClose?: () => void
  /**
   * 抽屉完全显示回调，在抽屉入场动画完成后触发
   * @returns
   */
  onShown?: () => void
}

export interface Drawer {
  close(): void
}

class Backdrop extends DivModule {
  /**
   * esc 键关闭监听
   */
  private escapeCloseListener: (e: KeyboardEvent) => void
  /**
   * 文档变化时的关闭监听
   */
  private docChangeCloseListener: () => void

  constructor(private opts: { onDestroy: () => void }) {
    super('wok-ui-drawer')
    // 每点击一次，关闭一个弹出的抽屉
    this.el.addEventListener('click', () => {
      const children = this.getChildren()
      if (children.length) {
        children[children.length - 1].destroy()
      }
    })
    // esc 按键关闭
    this.escapeCloseListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const children = this.getChildren()
        if (children.length) {
          children[children.length - 1].destroy()
        }
      }
    }
    document.addEventListener('keydown', this.escapeCloseListener)
    this.docChangeCloseListener = () => this.empty()
    window.addEventListener('popstate', this.docChangeCloseListener)
  }

  addContent(content: Content) {
    content.onDestroy(() => {
      if (this.getChildren().length === 0) {
        this.destroy()
      }
    })
    this.addChild(content)
  }

  mount(parentEl: Element): void {
    super.mount(parentEl)
    document.body.classList.add('wok-ui-drawer-lock-scroll')
  }

  destroy(): void {
    // 移除事件监听
    document.removeEventListener('keydown', this.escapeCloseListener)
    window.removeEventListener('popstate', this.docChangeCloseListener)
    document.body.classList.remove('wok-ui-drawer-lock-scroll')
    super.destroy()
    this.opts.onDestroy()
  }
}

class Content extends DivModule implements DivModule {
  private callbacked = false
  private destroyListener?: () => void
  private leaveAnimating = false
  constructor(readonly opts: DrawerOpts) {
    super('wok-ui-drawer-content', ANIMATION_PROVISION)
    this.el.addEventListener('click', e => e.stopPropagation())
    // 位置
    if (opts.placement === 'left') {
      this.el.classList.add('left')
    } else if (opts.placement === 'top') {
      this.el.classList.add('top')
    } else if (opts.placement === 'bottom') {
      this.el.classList.add('bottom')
    } else {
      this.el.classList.add('right')
    }
    this.enter()
      .then(() => {
        if (opts.onShown) {
          opts.onShown()
        }
      })
      .catch(showWarning)
    if (opts.replaceByBody) {
      this.addChild(...buildSubModules(opts.body))
      return
    }
    // 标题
    if (opts.title) {
      this.addChild({
        classNames: ['header'],
        children: [
          {
            classNames: ['title'],
            innerText: opts.title
          },
          {
            classNames: ['close'],
            innerHTML: '&times;',
            onClick: () => this.destroy()
          }
        ]
      })
    }
    // 内容
    this.addChild({
      classNames: ['body'],
      children: opts.body
    })
  }
  /**
   * 入场
   * @returns
   */
  private enter() {
    if (this.opts.placement === 'left') {
      return animate({ el: this.el, animation: Animation.SLIDE_LEFT })
    } else if (this.opts.placement === 'top') {
      return animate({ el: this.el, animation: Animation.SLIDE_TOP })
    } else if (this.opts.placement === 'bottom') {
      return animate({ el: this.el, animation: Animation.SLIDE_BOTTOM })
    } else {
      return animate({ el: this.el, animation: Animation.SLIDE_RIGHT })
    }
  }

  /**
   * 添加退场动画.
   */
  private async leave() {
    this.leaveAnimating = true
    try {
      if (this.opts.placement === 'left') {
        await animate({ el: this.el, animation: Animation.SLIDE_LEFT, reverse: true })
      } else if (this.opts.placement === 'top') {
        await animate({ el: this.el, animation: Animation.SLIDE_TOP, reverse: true })
      } else if (this.opts.placement === 'bottom') {
        await animate({ el: this.el, animation: Animation.SLIDE_BOTTOM, reverse: true })
      } else {
        await animate({ el: this.el, animation: Animation.SLIDE_RIGHT, reverse: true })
      }
    } finally {
      this.leaveAnimating = false
    }
  }

  onDestroy(listener: () => void) {
    this.destroyListener = listener
  }

  destroy(): void {
    if (this.leaveAnimating) {
      return
    }
    this.leave().then(() => {
      super.destroy()
      if (this.destroyListener) {
        this.destroyListener()
      }
      if (this.opts.onClose && !this.callbacked) {
        this.opts.onClose()
        this.callbacked = true
      }
    })
  }
}

let backdrop: Backdrop | undefined

/**
 * 在屏幕中展示滑动对话框.
 */
export function showDrawer(options: DrawerOpts): Drawer {
  if (!backdrop) {
    backdrop = new Backdrop({ onDestroy: () => (backdrop = undefined) })
    backdrop.mount(document.body)
  }
  const content = new Content(options)
  backdrop.addContent(content)
  return {
    close: () => content.destroy()
  }
}
