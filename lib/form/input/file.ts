import { getI18n } from '../../i18n'
import { SvgIcon } from '../../icon'
import { HBox } from '../../layout'
import { FullRenderingModule } from '../../render'
import { getSize, rem } from '../../size'
import { FormInput } from '../form-input'
import { ValidateResult } from './text'
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

class IconUpload extends SvgIcon {
  constructor() {
    // Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.
    super(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>'
    )
  }
}

/**
 * 占位信息
 */
class Placeholder extends FullRenderingModule {
  constructor(private readonly input: HTMLInputElement) {
    super()
    this.el.style.overflow = 'hidden'
    this.el.style.textOverflow = 'ellipsis'
    this.el.style.wordBreak = 'keep-all'
    this.el.style.whiteSpace = 'nowrap'
    input.addEventListener('change', () => this.render())
    this.buildContent()
  }

  protected buildContent(): void {
    if (!this.input.files || !this.input.files.length) {
      this.el.title = ''
      this.addChild(
        new HBox({
          gap: rem(0.5),
          align: 'center',
          children: [new IconUpload(), getI18n().buildMsg('choose-file')]
        })
      )
      return
    }
    const info = Array.from(this.input.files)
      .map(f => f.name)
      .join(',')
    this.el.title = info
    this.addChild(info)
  }
}
/**
 * 文件输入框
 */
export class FileInput extends FormInput {
  private readonly input: HTMLInputElement

  constructor(private readonly opts: FileInputOpts) {
    super(document.createElement('div'))
    // 构建 input 输入框
    this.input = document.createElement('input')
    this.input.type = 'file'
    this.input.accept = opts.accept || '*'
    this.input.multiple = !!opts.multiple
    this.input.style.display = 'none'
    this.input.addEventListener('change', () => this.handleChange())
    this.addChild({
      tag: 'label',
      classNames: 'wok-ui-input',
      style: { cursor: 'pointer' },
      preHandle: el => {
        // 尺寸
        const size = getSize()
        switch (this.opts.size) {
          case 'lg':
            el.style.setProperty('--input-font-size', `${size.textLg}px`)
            break
          case 'sm':
            el.style.setProperty('--input-font-size', `${size.textSm}px`)
            break
          default:
            el.style.setProperty('--input-font-size', `${size.text}px`)
            break
        }
      },
      children: [new Placeholder(this.input), this.input]
    })
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
        return {
          valid: false,
          msg: getI18n().buildMsg('form-err-min-size', this.formatFileSize(this.opts.minSize))
        }
      }
    } else if (this.opts.minSize) {
      if (totalSize < this.opts.minSize.minSize) {
        return { valid: false, msg: this.opts.minSize.errMsg }
      }
    }
    // 最大尺寸
    if (typeof this.opts.maxSize === 'number') {
      if (totalSize > this.opts.maxSize) {
        return {
          valid: false,
          msg: getI18n().buildMsg('form-err-max-size', this.formatFileSize(this.opts.maxSize))
        }
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
