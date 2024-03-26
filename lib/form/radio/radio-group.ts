import { getI18n } from '../../i18n'
import { ConvertibleModule, createDomModule } from '../../module'
import { generateId } from '../../utils/id'
import { FormInput } from '../form-input'
import { ValidateResult } from '../input'
import { InvalidFeedback } from '../invalid-feedback'
import { Radio } from './radio'
import './radio-group.less'

export interface RadioGroupOpts {
  /**
   * 是否显示为内联样式，默认是 false，表现为一行显示一个条目
   */
  inline?: boolean
  /**
   * 值
   */
  value?: string
  /**
   * 选项
   */
  options: Array<{ label: ConvertibleModule; value: string }>
  /**
   * 是否必填. 可自定义错误信息
   */
  required?: boolean | string
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 监听变化.
   */
  onChange?: (val: string) => void
}

export class RadioGroup extends FormInput {
  private name: string
  private value = ''
  constructor(private readonly opts: RadioGroupOpts) {
    super(document.createElement('div'))
    this.el.classList.add('wok-ui-radio-group')
    this.name = generateId()
    if (opts.inline) {
      this.el.classList.add('inline')
    }
    this.addChild(
      ...opts.options.map(opt =>
        createDomModule({
          tag: 'label',
          children: [
            new Radio({
              name: this.name,
              value: opt.value,
              checked: opts.value === opt.value,
              disabled: opts.disabled,
              onChecked: () => {
                this.value = opt.value
                if (this.opts.onChange) {
                  this.opts.onChange(this.value)
                }
                this.validate()
              }
            }),
            opt.label
          ]
        })
      )
    )
  }

  private __validate(): ValidateResult {
    if (!this.value) {
      if (this.opts.required) {
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
    return { valid: true }
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
    this.find(m => m instanceof Radio)
      .map(m => m as Radio)
      .forEach(m => m.setDisabled(disabled))
  }
}
