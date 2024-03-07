import { ANIMATION_PROVISION, Animation, animate } from '../animation'
import { Button } from '../button'
import { getI18n } from '../i18n'
import { showWarning } from '../message'
import { DivModule, Module, SubModulesOpt } from '../module'
import './style.less'
/**
 * 模态框选项
 */
export interface ModalOptions {
  /**
   * 标题，无标题不出现头部.
   */
  title?: string
  /**
   * 是否出现关闭按钮.只在有标题的情况下有效,如果设置为true会在右上角出现关闭图标.默认为 true.
   */
  closeBtn?: boolean
  /**
   * 对话框居中，如果设置为 true 对话框部分将垂直居中显示，默认出现在顶部.
   * 与全屏选项冲突，不可同时设置为 true ，全屏选项优先.
   */
  dialogCentered?: boolean
  /**
   * 主体部分.
   */
  body: SubModulesOpt
  /**
   * 使用 body 部分替换掉整个内容.body 默认会被包裹
   * 在 content 容器中，容器有背景色和内边距，该选项为 true ，则可以完全自定义内容.
   */
  replaceByBody?: boolean
  /**
   * 静态幕布，如果设置为 true 则点击背景幕布不能关闭模态框.
   */
  staticBackDrop?: boolean
  /**
   * 全屏.
   */
  fullscreen?: boolean
  /**
   * 宽度，默认 500px.
   */
  width?: number
  /**
   * 关闭回调.
   */
  onClose?: () => void
  /**
   * 确认回调，点击确认按钮后触发
   */
  onConfirm?: () => void
  /**
   * 自定义脚部，优先级高于按钮.
   */
  footer?: Module
  /**
   * 自定义圆角大小.
   */
  borderRadius?: number
  /**
   * 按钮设置，可选，可设置显示按钮或自定义按钮文字，有设置才会显示出来
   */
  buttons?: {
    confirm?: boolean | string
    cancel?: boolean | string
  }
  /**
   * 模态框完全显示回调，在模态框入场动画完成后触发
   * @returns
   */
  onShown?: () => void
}
/**
 * 模态框对象，每次展示模态框后返回一个实例对象，用于关闭打开的模态框.
 */
export interface Modal {
  close(): Promise<void>
}
/**
 * 背景.
 */
class Backdrop extends DivModule {
  constructor(private readonly opts: { onDestroy: () => void }) {
    super('wok-ui-modal')
  }

  addDialog(dialog: Dialog) {
    dialog.onDestroy(() => {
      if (this.getChildren().length === 0) {
        this.destroy()
      }
    })
    this.addChild(dialog)
  }

  async closeAllModals(): Promise<void> {
    const children = this.getChildren() as Dialog[]
    for (const child of children) {
      await child.close()
    }
  }
  /**
   * 删除子模块，如果子模块被清空，则自身也销毁.
   * @param moduleOrIndex
   * @returns
   */
  removeChild(moduleOrIndex: number | Module): boolean {
    const res = super.removeChild(moduleOrIndex)
    if (this.getChildren().length === 0) {
      this.destroy()
    }
    return res
  }

  destroy(): void {
    super.destroy()
    this.opts.onDestroy()
  }
}

/**
 * 对话框.
 */
class Dialog extends DivModule {
  /**
   * 回调标记，目的是防止重复回调，因为关闭有动画，有一个过程，在这个过程中用户重复操作会导致重复回调
   */
  private callbacked = false

  private destroyListener?: () => void

  constructor(private readonly opts: ModalOptions) {
    super('wok-ui-modal-dialog', ANIMATION_PROVISION)
    animate({ el: this.el, animation: Animation.SLIDE_TOP, duration: 300 }).then(() => {
      if (opts.onShown) {
        opts.onShown()
      }
    })
    if (this.opts.fullscreen) {
      this.el.classList.add('fullscreen')
    } else if (this.opts.dialogCentered) {
      this.el.classList.add('centered')
    }
    // 点击关闭
    this.el.addEventListener('click', ev => {
      ev.stopPropagation()
      this.tryDestroy()
    })
    // 完全自定义内容，使用 body 替换原本的内容
    if (opts.replaceByBody) {
      this.addChild({
        classNames: ['wok-ui-modal-content'],
        style: {
          // 圆角
          borderRadius:
            opts.borderRadius && opts.borderRadius > 0 ? `${opts.borderRadius}px` : undefined,
          // 宽度
          width: opts.fullscreen
            ? undefined
            : opts.width && opts.width > 0
            ? `${opts.width}px`
            : '500px'
        },
        onClick(ev) {
          // 防止传递到 dialog 这一层 div 触发关闭
          ev.stopPropagation()
        },
        children: opts.body
      })
      return
    }
    // 正常流程
    this.addChild({
      classNames: ['wok-ui-modal-content', 'normal'],
      style: {
        // 圆角
        borderRadius:
          opts.borderRadius && opts.borderRadius > 0 ? `${opts.borderRadius}px` : undefined,
        // 宽度
        width: opts.fullscreen
          ? undefined
          : opts.width && opts.width > 0
          ? `${opts.width}px`
          : '500px'
      },
      onClick(ev) {
        // 防止传递到 dialog 这一层 div 触发关闭
        ev.stopPropagation()
      },
      children: addChild => {
        // header
        if (opts.title) {
          addChild({
            classNames: ['wok-ui-modal-header'],
            children: addChild => {
              addChild({ classNames: ['title'], innerText: opts.title })
              // 关闭按钮
              if (opts.closeBtn !== false) {
                addChild({
                  classNames: ['close'],
                  innerHTML: '&times;',
                  onClick: () => {
                    this.close().catch(showWarning)
                  }
                })
              }
            }
          })
        }
        // body
        addChild({
          classNames: ['wok-ui-modal-body'],
          children: opts.body
        })
        // footer
        // 自定义
        if (opts.footer) {
          addChild(opts.footer)
        } else if (opts.buttons && (opts.buttons.cancel || opts.buttons.confirm)) {
          // 非自定义，判定按钮
          const { confirm, cancel } = opts.buttons
          addChild({
            classNames: ['wok-ui-modal-footer'],
            children: addChild => {
              if (confirm) {
                addChild(
                  new Button({
                    text: typeof confirm === 'string' ? confirm : getI18n().buildMsg('confirm'),
                    type: 'primary',
                    onClick(ev) {
                      if (opts.onConfirm) {
                        opts.onConfirm()
                      }
                    }
                  })
                )
              }
              if (cancel) {
                addChild(
                  new Button({
                    text: typeof cancel === 'string' ? cancel : getI18n().buildMsg('cancel'),
                    onClick: ev => this.close().catch(showWarning)
                  })
                )
              }
            }
          })
        }
      }
    })
  }

  /**
   * 尝试关闭销毁，由外部触发，如果模态框不支持点击自身以外的区域则无法销毁成功.
   */
  tryDestroy() {
    if (this.opts.staticBackDrop) {
      animate({ el: this.el, animation: Animation.SHAKE }).catch(showWarning)
      return
    }
    this.close().catch(showWarning)
  }

  onDestroy(listener: () => void) {
    this.destroyListener = listener
  }

  async close(): Promise<void> {
    await animate({ el: this.el, animation: Animation.SLIDE_TOP, duration: 300, reverse: true })
    this.destroy()
    if (this.destroyListener) {
      this.destroyListener()
    }
    if (this.opts.onClose && !this.callbacked) {
      this.opts.onClose()
      this.callbacked = true
    }
  }
}

let backdrop: Backdrop | undefined

/**
 * 显示模态框.
 * @param options
 */
export function showModal(options: ModalOptions): Modal {
  if (!backdrop) {
    backdrop = new Backdrop({ onDestroy: () => (backdrop = undefined) })
    backdrop.mount(document.body)
  }
  const modal = new Dialog(options)
  backdrop.addDialog(modal)
  return {
    close: () => modal.close()
  }
}

/**
 * 关闭所有的模态框.
 */
export async function closeAllModals(): Promise<void> {
  if (backdrop) {
    await backdrop.closeAllModals()
  }
}
