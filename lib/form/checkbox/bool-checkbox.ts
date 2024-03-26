import { getI18n } from '../../i18n'
import { ConvertibleModule } from '../../module'
import { Text } from '../../text'
import { FormInput } from '../form-input'
import { ValidateResult } from '../input'
import { InvalidFeedback } from '../invalid-feedback'
import './bool-checkbox.less'
import { Checkbox } from './checkbox'
/**
 * 布尔勾选框选项
 */
export interface BoolCheckboxOpts {
  /**
   * 初始值
   */
  value?: boolean
  /**
   * 必填，也说是必须勾选
   */
  required?: boolean | string
  /**
   * 勾选框的标题
   */
  label: ConvertibleModule
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 变化回调
   * @param value
   * @returns
   */
  onChange?: (value: boolean) => void
}
/**
 * 布尔勾选框，绑定布尔值，功能和 switch 组件一致
 */
export class BoolCheckbox extends FormInput {
  private __value = false
  private __disabled = false
  constructor(private readonly opts: BoolCheckboxOpts) {
    super(document.createElement('label'))
    if (opts.value) {
      this.__value = opts.value
    }
    this.addChild({
      classNames: ['wok-ui-bool-checkbox'],
      children: [
        new Checkbox({
          value: '',
          status: this.__value ? 'checked' : 'unchecked',
          disabled: this.__disabled,
          onChange: status => {
            this.__value = status === 'checked'
            if (this.opts.onChange) {
              this.opts.onChange(this.__value)
            }
            this.validate()
          }
        }),
        opts.label
      ]
    })
  }

  private __validate(): ValidateResult {
    if (this.opts.required && !this.__value) {
      return {
        valid: false,
        msg:
          typeof this.opts.required === 'string'
            ? this.opts.required
            : getI18n().buildMsg('form-err-must-check')
      }
    } else {
      return { valid: true }
    }
  }

  validate(): boolean {
    const res = this.__validate()
    this.getChildren()
      .filter(m => m instanceof InvalidFeedback)
      .forEach(m => m.destroy())
    if (!res.valid) {
      this.addChild(new InvalidFeedback(res.msg))
    }
    return res.valid
  }
  setDisabled(disabled: boolean): void {
    if (this.__disabled !== disabled) {
      this.__disabled = disabled
      this.find(m => m instanceof Checkbox)
        .map(m => m as Checkbox)
        .forEach(box => box.setDisabled(this.__disabled))
    }
  }
}
