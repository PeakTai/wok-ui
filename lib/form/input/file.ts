import { getSize } from '../../size';
import { FormInput } from '../form-input';
import { ValidateResult } from './text';
import { getI18n } from '../../i18n'
/**
 * 文件输入框选项
 */
export interface FileInputOpts {
  /**
   * 是否必填. 可自定义错误信息
   */
  required?: boolean | string
  /**
  * 尺寸
  */
  size?: 'sm' | 'default' | 'lg'
  /**
   * 接收类型，默认值为 *（所有）
   */
  accept?: string
  /**
   * 是否多选
   */
  multiple?: boolean
  /**
  * 最小选择数量，多选时才有效
  */
  minSelected?: number | { minSelected: number; errMsg: string }
  /**
   * 最大选择数量，多选时才有效
   */
  maxSelected?: number | { maxSelected: number; errMsg: string }
  /**
   * 最小文件尺寸（包含所有选择的文件），单位字节
   */
  minSize?: number | { minSize: number; errMsg: string }
  /**
   * 最大文件尺寸（包含所有选择的文件），单位字节
   */
  maxSize?: number | { maxSize: number; errMsg: string }
  /**
   * 自定义校验
   * @param val
   * @returns
   */
  validator?: (files: FileList) => ValidateResult
  /**
   * 更改回调
   * @param files
   * @returns
   */
  onChange?: (files: FileList | null) => void
}
/**
 * 文件输入框
 */
export class FileInput extends FormInput {
  private readonly input: HTMLInputElement
  constructor(private readonly opts: FileInputOpts) {
    super(document.createElement('div'))
    this.input = document.createElement('input')
    this.input.classList.add('wok-ui-input')
    this.input.type = 'file'
    this.input.accept = opts.accept || '*'
    this.input.multiple = !!opts.multiple
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
    this.input.onchange = () => this.handleChange()
    this.addChild(this.input)
  }

  private __validate(): ValidateResult {
    const { files } = this.input
    if (this.opts.required) {
      if (!files || !files.length) {
        return {
          valid: false,
          msg:
            typeof this.opts.required === 'string'
              ? this.opts.required
              : getI18n().buildMsg('form-err-required')
        }
      }
    }
    if (!files || !files.length) {
      return { valid: true }
    }
    // 最小选择
    if (typeof this.opts.minSelected === 'number') {
      if (files.length < this.opts.minSelected) {
        return {
          valid: false,
          msg: getI18n().buildMsg('form-err-min-files-select', `${this.opts.minSelected}`)
        }
      }
    } else if (this.opts.minSelected) {
      if (files.length < this.opts.minSelected.minSelected) {
        return { valid: false, msg: this.opts.minSelected.errMsg }
      }
    }
    // 最大选择
    if (this.opts.multiple) {
      if (typeof this.opts.maxSelected === 'number') {
        if (files.length > this.opts.maxSelected) {
          return {
            valid: false,
            msg: getI18n().buildMsg('form-err-max-files-select', `${this.opts.maxSelected}`)
          }
        }
      } else if (this.opts.maxSelected) {
        if (files.length > this.opts.maxSelected.maxSelected) {
          return { valid: false, msg: this.opts.maxSelected.errMsg }
        }
      }
    }
    let totalSize = 0
    for (const file of files) {
      totalSize += file.size
    }
    // 最小尺寸
    if (typeof this.opts.minSize === 'number') {
      if (totalSize < this.opts.minSize) {
        return { valid: false, msg: getI18n().buildMsg('form-err-min-size', this.formatFileSize(this.opts.minSize)) }
      }
    } else if (this.opts.minSize) {
      if (totalSize < this.opts.minSize.minSize) {
        return { valid: false, msg: this.opts.minSize.errMsg }
      }
    }
    // 最大尺寸
    if (typeof this.opts.maxSize === 'number') {
      if (totalSize > this.opts.maxSize) {
        return { valid: false, msg: getI18n().buildMsg('form-err-max-size', this.formatFileSize(this.opts.maxSize)) }
      }
    } else if (this.opts.maxSize) {
      if (totalSize > this.opts.maxSize.maxSize) {
        return { valid: false, msg: this.opts.maxSize.errMsg }
      }
    }
    // 自定义校验
    if (this.opts.validator) {
      return this.opts.validator(files)
    }
    return { valid: true }
  }

  private handleChange() {
    if (this.opts.onChange) {
      this.opts.onChange(this.input.files)
    }
    this.validate()
  }

  validate(): boolean {
    const validateRes = this.__validate()
    // 根据是否有效，显示反馈信息
    if (validateRes.valid) {
      this.input.classList.remove('invalid')
      this.hideInvalidFeedback()
    } else {
      this.input.classList.add('invalid')
      this.showInvalidFeedback(validateRes.msg)
    }
    return validateRes.valid
  }

  /**
 * 格式化文件大小
 * @param size
 * @returns
 */
  private formatFileSize(size: number): string {
    if (size < 1024) {
      return `${this.formatSizeNumber(size)}B`
    } else if (size < 1024 * 1024) {
      return `${this.formatSizeNumber(size / 1024)}KB`
    } else if (size < 1024 * 1024 * 1024) {
      return `${this.formatSizeNumber(size / (1024 * 1024))}MB`
    } else {
      return `${this.formatSizeNumber(size / (1024 * 1024 * 1024))}GB`
    }
  }

  private formatSizeNumber(size: number) {
    const s = size.toFixed(2)
    if (s.endsWith('.00')) {
      return s.substring(0, s.length - 3)
    } else if (s.endsWith('0')) {
      return s.substring(0, s.length - 1)
    } else {
      return s
    }
  }
}
