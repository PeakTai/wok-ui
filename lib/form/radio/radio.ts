import { Module } from '../../module'
import './radio.less'

export class Radio extends Module {
  private input: HTMLInputElement
  constructor(opts: {
    /**
     * 表单的属性名称，用于联动
     */
    name: string
    /**
     * 绑定值.
     */
    value: string
    /**
     * 初始状态
     */
    checked?: boolean
    /**
     * 禁用
     */
    disabled?: boolean
    /**
     * 选中回调
     * @param checked
     * @returns
     */
    onChecked?: () => void
  }) {
    const input = document.createElement('input')
    input.type = 'radio'
    input.name = opts.name
    input.value = opts.value
    input.classList.add('wok-ui-radio')
    super(input)
    this.input = input
    if (opts.checked) {
      input.checked = true
    }
    if (opts.disabled) {
      input.disabled = true
    }
    // radio 的 onchange 只会在被选中时才会触发
    // 当有一组 Radio 时，切换到其它的选项不会触发
    // 通过 api 赋值（input.checked = false）也不会触发
    if (opts.onChecked) {
      input.onchange = () => {
        if (input.checked && opts.onChecked) {
          opts.onChecked()
        }
      }
    }
  }

  isChecked() {
    return this.input.checked
  }

  setChecked(checked: boolean) {
    if (this.input.checked !== checked) {
      this.input.checked = checked
    }
  }

  getValue() {
    return this.input.value
  }

  setDisabled(disabled: boolean) {
    this.input.disabled = disabled
  }
}
