import { i18nMsg } from '../../i18n'
import { TextInput } from './text'

export interface DateInputOpts {
  /**
   * 是否必填. 可自定义错误信息
   */
  required?: boolean | string
  /**
   * 最大值
   */
  max?: Date | { max: Date; errMsg: string }
  /**
   * 最小值
   */
  min?: Date | { min: Date; errMsg: string }
  /**
   * 初始值
   */
  value?: Date
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
   * 变化监听
   * @param val
   * @returns
   */
  onChange?: (val?: Date) => void
  /**
   * 监听失去焦点
   */
  onBlur?: () => void
}

export class DateInput extends TextInput {
  constructor(dateOpts: DateInputOpts) {
    super({
      required: dateOpts.required,
      value: dateOpts.value ? formatDate(dateOpts.value) : undefined,
      disabled: dateOpts.disabled,
      placeholder: dateOpts.placeholder,
      size: dateOpts.size,
      validator(val) {
        if (!val) {
          if (dateOpts.required) {
            return {
              valid: false,
              msg:
                typeof dateOpts.required === 'string'
                  ? dateOpts.required
                  : i18nMsg('form-err-required')
            }
          }
          return { valid: true }
        }
        const date = parseDate(val)
        if (dateOpts.min instanceof Date) {
          if (date.getTime() < dateOpts.min.getTime()) {
            return { valid: false, msg: i18nMsg('form-err-min', `${formatDate(dateOpts.min)}`) }
          }
        } else if (dateOpts.min) {
          if (date.getTime() < dateOpts.min.min.getTime()) {
            return { valid: false, msg: dateOpts.min.errMsg }
          }
        }
        if (dateOpts.max instanceof Date) {
          if (date.getTime() > dateOpts.max.getTime()) {
            return { valid: false, msg: i18nMsg('form-err-max', `${formatDate(dateOpts.max)}`) }
          }
        } else if (dateOpts.max) {
          if (date.getTime() > dateOpts.max.max.getTime()) {
            return { valid: false, msg: dateOpts.max.errMsg }
          }
        }
        return { valid: true }
      },
      onChange(val) {
        if (!dateOpts.onChange) {
          return
        }
        if (!val) {
          dateOpts.onChange(undefined)
          return
        }
        dateOpts.onChange(parseDate(val))
      },
      onBlur: dateOpts.onBlur
    })
    this.input.type = 'date'
    if (dateOpts.min instanceof Date) {
      this.input.min = formatDate(dateOpts.min)
    } else if (dateOpts.min) {
      this.input.min = formatDate(dateOpts.min.min)
    }
    if (dateOpts.max instanceof Date) {
      this.input.min = formatDate(dateOpts.max)
    } else if (dateOpts.max) {
      this.input.min = formatDate(dateOpts.max.max)
    }
  }
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const monthStr = month >= 10 ? `${month}` : `0${month}`
  const dayStr = day >= 10 ? `${date}` : `0${day}`
  return `${year}-${monthStr}-${dayStr}`
}

function parseDate(dateStr: string): Date {
  // eg: 2022-11-5 00:00:00 GMT+0800
  return new Date(dateStr)
}
