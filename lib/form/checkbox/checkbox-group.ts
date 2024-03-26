import { getI18n } from '../../i18n'
import { ConvertibleModule, createDomModule } from '../../module'
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
  options: Array<{ label: ConvertibleModule; value: string }>
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
  private __values: string[] = []
  private __disabled = false
  constructor(private readonly opts: CheckboxGroupOpts) {
    super(document.createElement('div'))
    this.el.classList.add('wok-ui-checkbox-group')
    if (opts.inline) {
      this.el.classList.add('inline')
    }
    if (opts.value) {
      this.__values = [...opts.value]
    }
    if (opts.disabled) {
      this.__disabled = true
    }
    this.addChild(
      ...opts.options.map(opt =>
        createDomModule({
          tag: 'label',
          classNames: ['item'],
          children: [
            new Checkbox({
              value: opt.value,
              status: this.__values.includes(opt.value) ? 'checked' : 'unchecked',
              disabled: this.__disabled,
              onChange: status => {
                if (status === 'checked') {
                  if (!this.__values.includes(opt.value)) {
                    this.__values.push(opt.value)
                    this.handleChange()
                  }
                  // 达到上限后，将还没有选择的禁用
                  if (opts.maxSelected) {
                    const maxSelected =
                      typeof opts.maxSelected === 'number'
                        ? opts.maxSelected
                        : opts.maxSelected.maxSelected
                    if (this.__values.length >= maxSelected) {
                      this.find<Checkbox>(m => m instanceof Checkbox).forEach(box => {
                        if (!box.isChecked()) {
                          box.setDisabled(true)
                        }
                      })
                    }
                  }
                } else {
                  const idx = this.__values.indexOf(opt.value)
                  if (idx !== -1) {
                    this.__values.splice(idx, 1)
                    this.handleChange()
                  }
                  // 减小后，低于上限，将所有选项解除禁用
                  if (opts.maxSelected) {
                    const maxSelected =
                      typeof opts.maxSelected === 'number'
                        ? opts.maxSelected
                        : opts.maxSelected.maxSelected
                    if (this.__values.length < maxSelected) {
                      this.find<Checkbox>(m => m instanceof Checkbox).forEach(box => {
                        if (!box.isChecked()) {
                          box.setDisabled(false)
                        }
                      })
                    }
                  }
                }
              }
            }),
            opt.label
          ]
        })
      )
    )
  }

  private handleChange() {
    if (this.opts.onChange) {
      this.opts.onChange(this.__values)
    }
    this.validate()
  }

  private __validate(): ValidateResult {
    // 无值校验
    if (!this.__values.length) {
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
    // 有值校验
    if (typeof this.opts.minSelected === 'number') {
      if (this.__values.length < this.opts.minSelected) {
        return {
          valid: false,
          msg: getI18n().buildMsg('form-err-min-select', `${this.opts.minSelected}`)
        }
      }
    } else if (this.opts.minSelected) {
      if (this.__values.length < this.opts.minSelected.minSelected) {
        return { valid: false, msg: this.opts.minSelected.errMsg }
      }
    }
    if (typeof this.opts.maxSelected === 'number') {
      if (this.__values.length > this.opts.maxSelected) {
        return {
          valid: false,
          msg: getI18n().buildMsg('form-err-max-select', `${this.opts.maxSelected}`)
        }
      }
    } else if (this.opts.maxSelected) {
      if (this.__values.length > this.opts.maxSelected.maxSelected) {
        return { valid: false, msg: this.opts.maxSelected.errMsg }
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
    if (this.__disabled !== disabled) {
      this.__disabled = disabled
      this.find(m => m instanceof Checkbox)
        .map(m => m as Checkbox)
        .forEach(box => box.setDisabled(this.__disabled))
    }
  }
}
