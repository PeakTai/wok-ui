import { getI18n } from '../../i18n'
import { getSize } from '../../size'
import { FormInput } from '../form-input'
import { ValidateResult } from '../input'
import './style.less'

export interface SelectOpts {
  /**
   * 尺寸
   */
  size?: 'sm' | 'default' | 'lg'
  /**
   * 必填
   */
  required?: boolean | string
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 默认值
   */
  value?: string
  /**
   * 选项
   */
  options: Array<{ label: string; value: string } | string>
  /**
   * 变化监听
   * @param val
   * @returns
   */
  onChange?: (val: string) => void
}

export class Select extends FormInput {
  private select!: HTMLSelectElement

  constructor(private readonly opts: SelectOpts) {
    // 尺寸信息
    super(document.createElement('div'))
    this.addChild({
      tag: 'select',
      classNames: ['wok-ui-select'],
      attrs: { disabled: !!opts.disabled },
      postHandle: el => {
        this.select = el as HTMLSelectElement
        if (opts.value) {
          this.select.value = opts.value
        }
        this.select.addEventListener('change', ev => {
          if (this.opts.onChange) {
            this.opts.onChange(this.select.value)
          }
          this.validate()
        })
      },
      children: opts.options.map(opt => {
        if (typeof opt === 'string') {
          return {
            tag: 'option',
            innerText: opt,
            attrs: { value: opt }
          }
        } else {
          return {
            tag: 'option',
            innerText: opt.label,
            attrs: { value: opt.value }
          }
        }
      })
    })
    // 尺寸
    const size = getSize()
    switch (opts.size) {
      case 'lg':
        this.select.style.setProperty('--select-font-size', `${size.textLg}px`)
        break
      case 'sm':
        this.select.style.setProperty('--select-font-size', `${size.textSm}px`)
        break
      default:
        this.select.style.setProperty('--select-font-size', `${size.text}px`)
        break
    }
  }

  private __validate(val: string): ValidateResult {
    if (this.opts.required) {
      if (!val) {
        return {
          valid: false,
          msg:
            typeof this.opts.required === 'string'
              ? this.opts.required
              : getI18n().buildMsg('form-err-required')
        }
      }
    }
    return { valid: true }
  }

  validate(): boolean {
    const validateRes = this.__validate(this.select.value)
    // 根据是否有效，显示反馈信息
    if (validateRes.valid) {
      this.select.classList.remove('invalid')
      this.hideInvalidFeedback()
    } else {
      this.select.classList.add('invalid')
      this.showInvalidFeedback(validateRes.msg)
    }
    return validateRes.valid
  }
  setDisabled(disabled: boolean): void {
    this.select.disabled = disabled
  }
}
