import { getI18n } from '../../i18n'
import { createDomModule } from '../../module'
import { Text } from '../../text'
import { FormInput } from '../form-input'
import { ValidateResult } from '../input'
import { InvalidFeedback } from '../invalid-feedback'
import { Checkbox } from './checkbox'
import './checkbox-group.less'
/**
 * 选项.
 */
export interface CheckboxGroupOpts {
  /**
   * 是否显示为内联样式，默认是 false，表现为一行显示一个条目
   */
  inline?: boolean
  /**
   * 值
   */
  value?: string[]
  /**
   * 选项
   */
  options: Array<{ label: string; value: string }>
  /**
   * 是否必填. 可自定义错误信息
   */
  required?: boolean | string
  /**
   * 最小选择数量
   */
  minSelected?: number | { minSelected: number; errMsg: string }
  /**
   * 最大选择数量
   */
  maxSelected?: number | { maxSelected: number; errMsg: string }
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 监听变化.
   */
  onChange?: (vals: string[]) => void
}
/**
 * 多选框组.
 */
export class CheckboxGroup extends FormInput {
  #values: string[] = []
  #disabled = false
  readonly #opts: CheckboxGroupOpts
  constructor(opts: CheckboxGroupOpts) {
    super(document.createElement('div'))
    this.#opts = opts
    this.el.classList.add('wok-ui-checkbox-group')
    if (opts.inline) {
      this.el.classList.add('inline')
    }
    if (opts.value) {
      this.#values = [...opts.value]
    }
    if (opts.disabled) {
      this.#disabled = true
    }
    this.addChild(
      ...opts.options.map(opt =>
        createDomModule({
          tag: 'label',
          classNames: ['item'],
          children: [
            new Checkbox({
              value: opt.value,
              status: this.#values.includes(opt.value) ? 'checked' : 'unchecked',
              disabled: this.#disabled,
              onChange: status => {
                if (status === 'checked') {
                  if (!this.#values.includes(opt.value)) {
                    this.#values.push(opt.value)
                    this.#handleChange()
                  }
                } else {
                  const idx = this.#values.indexOf(opt.value)
                  if (idx !== -1) {
                    this.#values.splice(idx, 1)
                    this.#handleChange()
                  }
                }
              }
            }),
            new Text(opt.label)
          ]
        })
      )
    )
  }

  #handleChange() {
    if (this.#opts.onChange) {
      this.#opts.onChange(this.#values)
    }
    this.validate()
  }

  #validate(): ValidateResult {
    // 无值校验
    if (!this.#values.length) {
      if (this.#opts.required) {
        return {
          valid: false,
          msg:
            typeof this.#opts.required === 'string'
              ? this.#opts.required
              : getI18n().buildMsg('form-err-must-check')
        }
      } else {
        return { valid: true }
      }
    }
    // 有值校验
    if (typeof this.#opts.minSelected === 'number') {
      if (this.#values.length < this.#opts.minSelected) {
        return {
          valid: false,
          msg: getI18n().buildMsg('form-err-min-select', `${this.#opts.minSelected}`)
        }
      }
    } else if (this.#opts.minSelected) {
      if (this.#values.length < this.#opts.minSelected.minSelected) {
        return { valid: false, msg: this.#opts.minSelected.errMsg }
      }
    }
    if (typeof this.#opts.maxSelected === 'number') {
      if (this.#values.length > this.#opts.maxSelected) {
        return {
          valid: false,
          msg: getI18n().buildMsg('form-err-max-select', `${this.#opts.maxSelected}`)
        }
      }
    } else if (this.#opts.maxSelected) {
      if (this.#values.length > this.#opts.maxSelected.maxSelected) {
        return { valid: false, msg: this.#opts.maxSelected.errMsg }
      }
    }
    return { valid: true }
  }

  validate(): boolean {
    const res = this.#validate()
    this.getChildren()
      .filter(m => m instanceof InvalidFeedback)
      .forEach(m => m.destroy())
    if (!res.valid) {
      this.addChild(new InvalidFeedback(res.msg))
    }
    return res.valid
  }

  setDisabled(disabled: boolean): void {
    if (this.#disabled !== disabled) {
      this.#disabled = disabled
      this.find(m => m instanceof Checkbox)
        .map(m => m as Checkbox)
        .forEach(box => box.setDisabled(this.#disabled))
    }
  }
}
