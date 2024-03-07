import { Module } from '../../module'
import './checkbox.less'

/**
 * 多选框状态
 */
export type CheckboxStatus = 'checked' | 'unchecked' | 'indeterminate'

/**
 * 基础的勾选框.
 */
export class Checkbox extends Module {
  readonly value: string
  private __input: HTMLInputElement

  constructor(opts: {
    /**
     * 绑定值.
     */
    value: string
    /**
     * 初始状态
     */
    status?: CheckboxStatus
    /**
     * 禁用
     */
    disabled?: boolean
    /**
     * 变化回调
     * @param checked
     * @returns
     */
    onChange?: (status: CheckboxStatus) => void
  }) {
    const input = document.createElement('input')
    input.type = 'checkbox'
    input.classList.add('wok-ui-checkbox')
    super(input)
    input.value = opts.value
    this.value = opts.value
    this.__input = input
    if (opts.disabled) {
      input.disabled = opts.disabled
    }
    this.setStatus(opts.status || 'unchecked')
    if (opts.onChange) {
      const { onChange } = opts
      this.el.addEventListener('change', ev => {
        ev.stopPropagation()
        onChange(this.getStatus())
      })
    }
  }
  /**
   * 设置状态
   * @param status
   * @returns
   */
  setStatus(status: CheckboxStatus) {
    if (status === this.getStatus()) {
      return
    }
    switch (status) {
      case 'checked':
        this.__input.checked = true
        this.__input.indeterminate = false
        break
      case 'unchecked':
        this.__input.checked = false
        this.__input.indeterminate = false
        break
      case 'indeterminate':
        this.__input.checked = false
        this.__input.indeterminate = true
        break
    }
  }

  getStatus(): CheckboxStatus {
    if (this.__input.checked) {
      return 'checked'
    }
    if (this.__input.indeterminate) {
      return 'indeterminate'
    }
    return 'unchecked'
  }

  isChecked() {
    return this.__input.checked
  }

  setDisabled(disabled: boolean): void {
    this.__input.disabled = disabled
  }
}
