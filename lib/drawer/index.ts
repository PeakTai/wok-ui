// 抽屉
import { ANIMATION_PROVISION, Animation, animate } from '../animation'
import { showWarning } from '../message'
import { ConvertibleModule, DivModule, createDomModule } from '../module'
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
  body: ConvertibleModule
  /**
   * 关闭事件回调
   */
  onClose?: () => void
}

export interface Drawer {
  close(): void
}

class Backdrop extends DivModule {
  readonly #opts: { onDestroy: () => void }
  constructor(opts: { onDestroy: () => void }) {
    super('wok-ui-drawer')
    this.#opts = opts
    // 每点击一次，关闭一个弹出的抽屉
    this.el.addEventListener('click', () => {
      const children = this.getChildren()
      if (children.length) {
        children[children.length - 1].destroy()
      }
    })
  }
  /**
   * 处理内容销毁，如果最后一个弹出的内容也销毁了，则销毁自身
   */
  handleContentDestroy() {
    if (this.getChildren().length === 0) {
      this.destroy()
    }
  }

  addContent(content: Content) {
    content.onDestroy(this.handleContentDestroy.bind(this))
    this.addChild(content)
  }

  destroy(): void {
    super.destroy()
    this.#opts.onDestroy()
  }
}

class Content extends DivModule implements DivModule {
  #callbacked = false
  #destroyListener?: () => void
  readonly #opts: DrawerOpts
  constructor(opts: DrawerOpts) {
    super('wok-ui-drawer-content', ANIMATION_PROVISION)
    this.#opts = opts
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
    this.#enter().catch(showWarning)
    // 标题
    if (opts.title) {
      this.addChild(
        createDomModule({
          classNames: ['header'],
          children: [
            createDomModule({
              classNames: ['title'],
              innerText: opts.title
            }),
            createDomModule({
              classNames: ['close'],
              innerHTML: '&times;',
              onClick: () => this.destroy()
            })
          ]
        })
      )
    }
    // 内容
    this.addChild(
      createDomModule({
        classNames: ['body'],
        children: [opts.body]
      })
    )
  }
  /**
   * 入场
   * @returns
   */
  #enter() {
    if (this.#opts.placement === 'left') {
      return animate({ el: this.el, animation: Animation.SLIDE_LEFT })
    } else if (this.#opts.placement === 'top') {
      return animate({ el: this.el, animation: Animation.SLIDE_TOP })
    } else if (this.#opts.placement === 'bottom') {
      return animate({ el: this.el, animation: Animation.SLIDE_BOTTOM })
    } else {
      return animate({ el: this.el, animation: Animation.SLIDE_RIGHT })
    }
  }

  #leaveAnimating = false
  /**
   * 添加退场动画.
   */
  async #leave() {
    this.#leaveAnimating = true
    try {
      if (this.#opts.placement === 'left') {
        await animate({ el: this.el, animation: Animation.SLIDE_LEFT, reverse: true })
      } else if (this.#opts.placement === 'top') {
        await animate({ el: this.el, animation: Animation.SLIDE_TOP, reverse: true })
      } else if (this.#opts.placement === 'bottom') {
        await animate({ el: this.el, animation: Animation.SLIDE_BOTTOM, reverse: true })
      } else {
        await animate({ el: this.el, animation: Animation.SLIDE_RIGHT, reverse: true })
      }
    } finally {
      this.#leaveAnimating = false
    }
  }

  onDestroy(listener: () => void) {
    this.#destroyListener = listener
  }

  destroy(): void {
    if (this.#leaveAnimating) {
      return
    }
    this.#leave().then(() => {
      super.destroy()
      if (this.#destroyListener) {
        this.#destroyListener()
      }
      if (this.#opts.onClose && !this.#callbacked) {
        this.#opts.onClose()
        this.#callbacked = true
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
