import { getI18n } from '../../i18n'
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

  private textareaEl: HTMLTextAreaElement

  constructor(private readonly textAreaopts: TextInputOpts & { rows?: number }) {
    super(document.createElement('div'))
    this.textareaEl = document.createElement('textarea')
    this.textareaEl.classList.add('wok-ui-input')
    // 尺寸
    const size = getSize()
    switch (textAreaopts.size) {
      case 'lg':
        this.textareaEl.style.setProperty('--input-font-size', `${size.textLg}px`)
        break
      case 'sm':
        this.textareaEl.style.setProperty('--input-font-size', `${size.textSm}px`)
        break
      default:
        this.textareaEl.style.setProperty('--input-font-size', `${size.text}px`)
        break
    }
    this.addChild(this.textareaEl)
    this.textareaEl.rows = textAreaopts.rows && textAreaopts.rows > 0 ? textAreaopts.rows : 3
    if (typeof textAreaopts.minLength === 'number') {
      this.textareaEl.minLength = textAreaopts.minLength
    } else if (textAreaopts.minLength) {
      this.textareaEl.minLength = textAreaopts.minLength.minLength
    }
    if (typeof textAreaopts.maxLength === 'number') {
      this.textareaEl.maxLength = textAreaopts.maxLength
    } else if (textAreaopts.maxLength) {
      this.textareaEl.maxLength = textAreaopts.maxLength.maxLength
    }
    if (textAreaopts.required) {
      this.textareaEl.required = true
    }
    if (textAreaopts.value) {
      this.textareaEl.value = textAreaopts.value
    }
    if (textAreaopts.disabled) {
      this.textareaEl.disabled = true
    }
    if (textAreaopts.placeholder) {
      this.textareaEl.placeholder = textAreaopts.placeholder
    }
    this.textareaEl.addEventListener('compositionstart', () => (this.composing = true))
    this.textareaEl.addEventListener('compositionend', () => {
      this.composing = false
      this.handleChange()
    })
    this.textareaEl.addEventListener('input', () => {
      if (this.composing) {
        return
      }
      this.handleChange()
    })
    if (textAreaopts.onBlur) {
      const { onBlur } = textAreaopts
      this.textareaEl.addEventListener('blur', () => onBlur())
    }
  }

  private handleChange() {
    if (this.textAreaopts.onChange) {
      this.textAreaopts.onChange(this.textareaEl.value)
    }
    this.validate()
  }

  private __validate(val: string): ValidateResult {
    if (this.textAreaopts.required) {
      if (!val) {
        return {
          valid: false,
          msg:
            typeof this.textAreaopts.required === 'string'
              ? this.textAreaopts.required
              : getI18n().buildMsg('form-err-required')
        }
      }
    }
    if (!val) {
      return { valid: true }
    }
    if (typeof this.textAreaopts.minLength === 'number') {
      if (val.length < this.textAreaopts.minLength) {
        return {
          valid: false,
          msg: getI18n().buildMsg('form-err-min-length', `${this.textAreaopts.minLength}`)
        }
      }
    } else if (this.textAreaopts.minLength) {
      if (val.length < this.textAreaopts.minLength.minLength) {
        return { valid: false, msg: this.textAreaopts.minLength.errMsg }
      }
    }
    if (typeof this.textAreaopts.maxLength === 'number') {
      if (val.length > this.textAreaopts.maxLength) {
        return {
          valid: false,
          msg: getI18n().buildMsg('form-err-max-length', `${this.textAreaopts.maxLength}`)
        }
      }
    } else if (this.textAreaopts.maxLength) {
      if (val.length > this.textAreaopts.maxLength.maxLength) {
        return { valid: false, msg: this.textAreaopts.maxLength.errMsg }
      }
    }
    // 自定义校验
    if (this.textAreaopts.validator) {
      return this.textAreaopts.validator(val)
    }
    return { valid: true }
  }

  validate(): boolean {
    const validateRes = this.__validate(this.textareaEl.value)
    // 根据是否有效，显示反馈信息
    this.getChildren()
      .filter(m => m instanceof InvalidFeedback)
      .forEach(m => m.destroy())
    if (validateRes.valid) {
      this.textareaEl.classList.remove('invalid')
    } else {
      this.textareaEl.classList.add('invalid')
      this.addChild(new InvalidFeedback(validateRes.msg))
    }
    return validateRes.valid
  }

  setDisabled(disabled: boolean): void {
    this.textareaEl.disabled = disabled
  }
}
