import { getColor } from '../color'
import { Module } from '../module'
import { getSize } from '../size'
import './style.less'

/**
 * 按钮选项
 */
export interface ButtonOpts {
  /**
   * 文本信息.
   */
  text: string
  /**
   * 表单类型. submit 类型的按钮作为 Form 模块的子孙模块，可以起到提交表单的作用, reset
   * 类型也可以起到重置作用，但是仅对部分基于原生表单元素的表单输入模块有用，目前还没有规范表单输入模块统一支持重置功能.
   */
  formType?: 'submit' | 'reset'
  /**
   * 类型，不同的类型有不同的含义，对应不同的颜色
   * primary 主要，表示推荐的操作
   * default  默认，比主要优先级低，普通的操作，不支持描边
   * success  成功，用于完成或结束操作
   * danger  危险，表示操作有风险，不建议的操作
   * warning 警告，表示操作可能有风险，需要考虑清楚再操作
   *
   */
  type?: 'primary' | 'success' | 'danger' | 'warning' | 'default'
  /**
   * 是否显示为描边（镂空）样式，默认类型不支持描边
   */
  outline?: boolean
  /**
   * 是否显示为块级
   */
  block?: boolean
  /**
   * 是否显示为禁用状态
   */
  disabled?: boolean
  /**
   * 尺寸
   */
  size?: 'sm' | 'default' | 'lg'
  /**
   * 指定宽度
   */
  width?: number
  /**
   * 绑定点击事件回调
   * @param ev
   * @returns
   */
  onClick?: (ev: MouseEvent) => void
}
/**
 * 按钮
 */
export class Button extends Module {
  constructor(opts: ButtonOpts) {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.classList.add('wok-ui-btn')
    super(btn)
    btn.innerText = opts.text
    if (opts.block) {
      btn.classList.add('block')
    }
    if (opts.disabled) {
      btn.disabled = true
    }
    if (opts.onClick) {
      btn.onclick = opts.onClick
    }
    if (opts.width && opts.width > 0) {
      btn.style.width = `${opts.width}px`
    }
    // 类型
    switch (opts.type) {
      case 'primary':
        this.setCssVars(getColor().primary, !!opts.outline)
        break
      case 'danger':
        this.setCssVars(getColor().danger, !!opts.outline)
        break
      case 'success':
        this.setCssVars(getColor().success, !!opts.outline)
        break
      case 'warning':
        this.setCssVars(getColor().warning, !!opts.outline)
        break
      default:
        // 默认
        this.el.style.setProperty('--btn-bg-color', 'transparent')
        this.el.style.setProperty('--btn-color', getColor().text)
        this.el.style.setProperty('--btn-border-color', getColor().border)
        break
    }
    // 表单类型
    btn.type = opts.formType || 'button'
    // 尺寸
    const size = getSize()
    switch (opts.size) {
      case 'lg':
        btn.style.setProperty('--btn-font-size', `${size.textLg}px`)
        break
      case 'sm':
        btn.style.setProperty('--btn-font-size', `${size.textSm}px`)
        break
      default:
        btn.style.setProperty('--btn-font-size', `${size.text}px`)
        break
    }
  }

  private setCssVars(color: string, outline: boolean) {
    if (outline) {
      this.el.style.setProperty('--btn-bg-color', 'transparent')
      this.el.style.setProperty('--btn-color', color)
      this.el.style.setProperty('--btn-border-color', color)
    } else {
      this.el.style.setProperty('--btn-bg-color', color)
      this.el.style.setProperty('--btn-color', 'white')
      this.el.style.setProperty('--btn-border-color', color)
    }
  }

  setDisabled(disabled: boolean) {
    const btn = this.el as HTMLButtonElement
    btn.disabled = disabled
    return this
  }

  onClick(listener: (ev: MouseEvent) => void) {
    const btn = this.el as HTMLButtonElement
    btn.onclick = listener
    return this
  }
}
