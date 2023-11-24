import { getI18n } from '../../i18n'
import { getSize } from '../../size'
import { FormInput } from '../form-input'
import { InvalidFeedback } from '../invalid-feedback'

export type ValidateResult = { valid: true } | { valid: false; msg: string }

export interface TextInputOpts {
  /**
   * 是否必填. 可自定义错误信息
   */
  required?: boolean | string
  /**
   * 最大长度
   */
  maxLength?: number | { maxLength: number; errMsg: string }
  /**
   * 最小长度
   */
  minLength?: number | { minLength: number; errMsg: string }
  /**
   * 初始值
   */
  value?: string
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 占位提示信息
   */
  placeholder?: string
  /**
   * 尺寸
   */
  size?: 'sm' | 'default' | 'lg'
  /**
   * 自定义校验
   * @param val
   * @returns
   */
  validator?: (val: string) => ValidateResult
  /**
   * 变化监听
   * @param val
   * @returns
   */
  onChange?: (val: string) => void
  /**
   * 监听失去焦点
   */
  onBlur?: () => void
  /**
   * 自动获取焦点
   */
  autofocus?: boolean
}

/**
 * 文本输入框
 */
export class TextInput extends FormInput {
  /**
   * 组合中，true 表示输入法正在输入中.中文输入时，在备选文字没有上屏时，输入框里是拼音字母，我们不希望输入每按一下按键，
   * 带有拼音字母的内容也回调，这样可能会导致回调过于频繁.
   */
  #composing = false

  protected input: HTMLInputElement

  readonly #opts: TextInputOpts

  constructor(opts: TextInputOpts) {
    super(document.createElement('div'))
    this.#opts = opts
    this.input = document.createElement('input')
    this.input.type = 'text'
    this.input.classList.add('wok-ui-input')
    // 尺寸
    const size = getSize()
    switch (opts.size) {
      case 'lg':
        this.input.style.setProperty('--input-font-size', `${size.textLg}px`)
        break
      case 'sm':
        this.input.style.setProperty('--input-font-size', `${size.textSm}px`)
        break
      default:
        this.input.style.setProperty('--input-font-size', `${size.text}px`)
        break
    }
    this.addChild(this.input)
    this.input.placeholder = opts.placeholder || ''
    if (typeof opts.minLength === 'number') {
      this.input.minLength = opts.minLength
    } else if (opts.minLength) {
      this.input.minLength = opts.minLength.minLength
    }
    if (typeof opts.maxLength === 'number') {
      this.input.maxLength = opts.maxLength
    } else if (opts.maxLength) {
      this.input.maxLength = opts.maxLength.maxLength
    }
    if (opts.required) {
      this.input.required = true
    }
    if (opts.value) {
      this.input.value = opts.value
    }
    if (opts.disabled) {
      this.input.disabled = true
    }
    if (opts.autofocus) {
      setTimeout(() => {
        this.input.focus()
      }, 0)
    }
    this.input.addEventListener('compositionstart', () => (this.#composing = true))
    this.input.addEventListener('compositionend', () => {
      this.#composing = false
      this.#handleChange()
    })
    this.input.addEventListener('input', () => {
      if (this.#composing) {
        return
      }
      this.#handleChange()
    })
    if (opts.onBlur) {
      this.input.addEventListener('blur', opts.onBlur)
    }
  }

  #handleChange() {
    if (this.#opts.onChange) {
      this.#opts.onChange(this.input.value)
    }
    this.validate()
  }

  #validate(val: string): ValidateResult {
    if (this.#opts.required) {
      if (!val) {
        return {
          valid: false,
          msg:
            typeof this.#opts.required === 'string'
              ? this.#opts.required
              : getI18n().buildMsg('form-err-required')
        }
      }
    }
    if (!val) {
      return { valid: true }
    }
    if (typeof this.#opts.minLength === 'number') {
      if (val.length < this.#opts.minLength) {
        return {
          valid: false,
          msg: getI18n().buildMsg('form-err-min-length', `${this.#opts.minLength}`)
        }
      }
    } else if (this.#opts.minLength) {
      if (val.length < this.#opts.minLength.minLength) {
        return { valid: false, msg: this.#opts.minLength.errMsg }
      }
    }
    if (typeof this.#opts.maxLength === 'number') {
      if (val.length > this.#opts.maxLength) {
        return {
          valid: false,
          msg: getI18n().buildMsg('form-err-max-length', `${this.#opts.maxLength}`)
        }
      }
    } else if (this.#opts.maxLength) {
      if (val.length > this.#opts.maxLength.maxLength) {
        return { valid: false, msg: this.#opts.maxLength.errMsg }
      }
    }
    // 自定义校验
    if (this.#opts.validator) {
      return this.#opts.validator(val)
    }
    return { valid: true }
  }

  validate(): boolean {
    const validateRes = this.#validate(this.input.value)
    // 根据是否有效，显示反馈信息
    this.getChildren()
      .filter(m => m instanceof InvalidFeedback)
      .forEach(m => m.destroy())
    if (validateRes.valid) {
      this.input.classList.remove('invalid')
    } else {
      this.input.classList.add('invalid')
      this.addChild(new InvalidFeedback(validateRes.msg))
    }
    return validateRes.valid
  }

  setDisabled(disabled: boolean): void {
    this.input.disabled = disabled
  }
}
