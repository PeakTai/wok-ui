import { i18nMsg } from '../../i18n'
import { getSize } from '../../size'
import { FormInput } from '../form-input'
import { InvalidFeedback } from '../invalid-feedback'
import { TextInputOpts, ValidateResult } from './text'

/**
 * 多行文本
 *
 * 与 TextInput 重复代码过多，以后有机会重构下，减少重复
 */
export class TextArea extends FormInput {
  /**
   * 组合中，true 表示输入法正在输入中.中文输入时，在备选文字没有上屏时，输入框里是拼音字母，我们不希望输入每按一下按键，
   * 带有拼音字母的内容也回调，这样可能会导致回调过于频繁.
   */
  private composing = false

  private textarea: HTMLTextAreaElement

  constructor(private readonly opts: TextInputOpts & { rows?: number }) {
    super(document.createElement('div'))
    this.textarea = document.createElement('textarea')
    this.textarea.classList.add('wok-ui-input')
    // 尺寸
    const size = getSize()
    switch (opts.size) {
      case 'lg':
        this.textarea.style.setProperty('--input-font-size', `${size.textLg}px`)
        break
      case 'sm':
        this.textarea.style.setProperty('--input-font-size', `${size.textSm}px`)
        break
      default:
        this.textarea.style.setProperty('--input-font-size', `${size.text}px`)
        break
    }
    this.addChild(this.textarea)
    this.textarea.rows = opts.rows && opts.rows > 0 ? opts.rows : 3
    if (typeof opts.minLength === 'number') {
      this.textarea.minLength = opts.minLength
    } else if (opts.minLength) {
      this.textarea.minLength = opts.minLength.minLength
    }
    if (typeof opts.maxLength === 'number') {
      this.textarea.maxLength = opts.maxLength
    } else if (opts.maxLength) {
      this.textarea.maxLength = opts.maxLength.maxLength
    }
    if (opts.required) {
      this.textarea.required = true
    }
    if (opts.value) {
      this.textarea.value = opts.value
    }
    if (opts.disabled) {
      this.textarea.disabled = true
    }
    if (opts.placeholder) {
      this.textarea.placeholder = opts.placeholder
    }
    this.textarea.addEventListener('compositionstart', () => (this.composing = true))
    this.textarea.addEventListener('compositionend', () => {
      this.composing = false
      this.handleChange()
    })
    this.textarea.addEventListener('input', () => {
      if (this.composing) {
        return
      }
      this.handleChange()
    })
    if (opts.onBlur) {
      const { onBlur } = opts
      this.textarea.addEventListener('blur', () => onBlur())
    }
  }

  private handleChange() {
    if (this.opts.onChange) {
      this.opts.onChange(this.textarea.value)
    }
    this.validate()
  }

  private _validate(val: string): ValidateResult {
    if (this.opts.required) {
      if (!val) {
        return {
          valid: false,
          msg:
            typeof this.opts.required === 'string'
              ? this.opts.required
              : i18nMsg('form-err-required')
        }
      }
    }
    if (!val) {
      return { valid: true }
    }
    if (typeof this.opts.minLength === 'number') {
      if (val.length < this.opts.minLength) {
        return { valid: false, msg: i18nMsg('form-err-min-length', `${this.opts.minLength}`) }
      }
    } else if (this.opts.minLength) {
      if (val.length < this.opts.minLength.minLength) {
        return { valid: false, msg: this.opts.minLength.errMsg }
      }
    }
    if (typeof this.opts.maxLength === 'number') {
      if (val.length > this.opts.maxLength) {
        return { valid: false, msg: i18nMsg('form-err-max-length', `${this.opts.maxLength}`) }
      }
    } else if (this.opts.maxLength) {
      if (val.length > this.opts.maxLength.maxLength) {
        return { valid: false, msg: this.opts.maxLength.errMsg }
      }
    }
    // 自定义校验
    if (this.opts.validator) {
      return this.opts.validator(val)
    }
    return { valid: true }
  }

  validate(): boolean {
    const validateRes = this._validate(this.textarea.value)
    // 根据是否有效，显示反馈信息
    this.getChildren()
      .filter(m => m instanceof InvalidFeedback)
      .forEach(m => m.destroy())
    if (validateRes.valid) {
      this.textarea.classList.remove('invalid')
    } else {
      this.textarea.classList.add('invalid')
      this.addChild(new InvalidFeedback(validateRes.msg))
    }
    return validateRes.valid
  }

  setDisabled(disabled: boolean): void {
    this.textarea.disabled = disabled
  }
}
