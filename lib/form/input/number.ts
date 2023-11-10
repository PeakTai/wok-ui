import { getI18n } from '../../i18n'
import { TextInput, ValidateResult } from './text'

export interface NumberInputOpts {
  /**
   * 是否必填. 可自定义错误信息
   */
  required?: boolean | string
  /**
   * 最大值
   */
  max?: number | { max: number; errMsg: string }
  /**
   * 最小值
   */
  min?: number | { min: number; errMsg: string }
  /**
   * 初始值
   */
  value?: number
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
  validator?: (val: number) => ValidateResult
  /**
   * 变化监听
   * @param val
   * @returns
   */
  onChange?: (val?: number) => void
  /**
   * 监听失去焦点
   */
  onBlur?: () => void
}

/**
 * 文本输入框
 */
export class NumberInput extends TextInput {
  constructor(numOpts: NumberInputOpts) {
    super({
      required: numOpts.required,
      placeholder: numOpts.placeholder,
      value: typeof numOpts.value === 'number' ? `${numOpts.value}` : undefined,
      disabled: numOpts.disabled,
      size: numOpts.size,
      validator(val) {
        if (!val) {
          if (numOpts.required) {
            return {
              valid: false,
              msg:
                typeof numOpts.required === 'string'
                  ? numOpts.required
                  : getI18n().buildMsg('form-err-required')
            }
          }
          return { valid: true }
        }
        const num = parseFloat(val)
        if (isNaN(num)) {
          return { valid: false, msg: getI18n().buildMsg('form-err-number') }
        }
        if (typeof numOpts.max === 'number') {
          if (num > numOpts.max) {
            return { valid: false, msg: getI18n().buildMsg('form-err-max', `${numOpts.max}`) }
          }
        } else if (numOpts.max) {
          if (num > numOpts.max.max) {
            return { valid: false, msg: numOpts.max.errMsg }
          }
        }
        if (typeof numOpts.min === 'number') {
          if (num < numOpts.min) {
            return { valid: false, msg: getI18n().buildMsg('form-err-min', `${numOpts.min}`) }
          }
        } else if (numOpts.min) {
          if (num < numOpts.min.min) {
            return { valid: false, msg: numOpts.min.errMsg }
          }
        }
        if (numOpts.validator) {
          return numOpts.validator(num)
        }
        return { valid: true }
      },
      onChange(val) {
        if (numOpts.onChange) {
          if (!val) {
            numOpts.onChange(undefined)
          } else {
            numOpts.onChange(parseFloat(val))
          }
        }
      },
      onBlur: numOpts.onBlur
    })
    this.input.type = 'number'
    if (typeof numOpts.max === 'number') {
      this.input.max = `${numOpts.max}`
    } else if (numOpts.max) {
      this.input.max = `${numOpts.max.max}`
    }
    if (typeof numOpts.min === 'number') {
      this.input.min = `${numOpts.min}`
    } else if (numOpts.min) {
      this.input.min = `${numOpts.min.min}`
    }
  }
}
