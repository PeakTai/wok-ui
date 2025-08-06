import { getI18n } from '../../i18n'
import { getSize } from '../../size'
import { FormInput } from '../form-input'
import { TextInputOpts, ValidateResult } from './text'

export interface TextAreaOpts extends TextInputOpts {
  /**
   * 默认行数
   */
  rows?: number
  /**
   * 是否自动高度
   */
  autoHeight?: boolean
}
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
  /**
   * 要处理自动高度逻辑的标识，如果原生 css 不能支持 field-sizing，则需要进行额外的处理
   */
  private handleAutoHeight = false

  constructor(private readonly textAreaopts: TextAreaOpts) {
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
      8
      if (this.composing) {
        return
      }
      this.handleChange()
    })
    if (textAreaopts.onBlur) {
      const { onBlur } = textAreaopts
      this.textareaEl.addEventListener('blur', () => onBlur())
    }
    if (textAreaopts.autoHeight) {
      this.textareaEl.style.setProperty('field-sizing', 'content')
      // 浏览器不兼容
      if (this.textareaEl.style.getPropertyValue('field-sizing') !== 'content') {
        this.handleAutoHeight = true
      }
    }
  }

  mount(parentEl: Element): void {
    super.mount(parentEl)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // 自动高度的处理
        if (this.handleAutoHeight && this.textareaEl.value.trim()) {
          this.textareaEl.style.height = this.textareaEl.scrollHeight + 2 + 'px'
        }
        if (this.textAreaopts.autofocus) {
          this.textareaEl.focus()
        }
      })
    })
  }

  focus() {
    this.textareaEl.focus()
  }

  setValue(value: string) {
    this.textareaEl.value = value
    this.handleChange()
  }

  private handleChange() {
    // 自动高度的处理
    if (this.handleAutoHeight) {
      // 这里将高度设置为 auto 才能获取到浏览器的计算高度，但是在
      // textarea 高度超过一屏的情况下，输入中文时浏览器会跳动，
      // 实测只有 firefox 不会发生跳动
      // 尤其是移动端体验会很差，用户无法连续输入
      // 暂时不再使用，这样也就无法支持高度自动收缩了
      // this.textareaEl.style.height = 'auto'
      if (this.textareaEl.scrollHeight !== this.textareaEl.clientHeight) {
        // 加2像素是上下边框的高度，scrollHeight 不包括元素的边框、外边距以及水平滚动条
        this.textareaEl.style.height = this.textareaEl.scrollHeight + 2 + 'px'
      }
    }
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
    if (validateRes.valid) {
      this.textareaEl.classList.remove('invalid')
      this.hideInvalidFeedback()
    } else {
      this.textareaEl.classList.add('invalid')
      this.showInvalidFeedback(validateRes.msg)
    }
    return validateRes.valid
  }

  setDisabled(disabled: boolean): void {
    this.textareaEl.disabled = disabled
  }
}
