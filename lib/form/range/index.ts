import { HSplitBox } from '../../layout'
import { rem } from '../../size'
import { Text } from '../../text'
import { FormInput } from '../form-input'
import './style.less'

export interface RangeOpts {
  /**
   * 默认值
   */
  value: number
  /**
   * 最小值
   */
  min: number
  /**
   * 最大值
   */
  max: number
  /**
   * 步进，默认1
   */
  step?: number
  /**
   * 是否展示值
   */
  showValue?: boolean
  /**
   * 变化监听
   * @param val
   * @returns
   */
  onChange?: (val: number) => void
}

export class Range extends FormInput {
  private input: HTMLInputElement
  constructor(opts: RangeOpts) {
    super(document.createElement('div'))
    this.input = document.createElement('input')
    this.input.classList.add('wok-ui-range')
    this.input.type = 'range'
    this.input.min = `${opts.min}`
    this.input.max = `${opts.max}`
    if (typeof opts.step === 'number') {
      this.input.step = `${opts.step}`
    } else {
      this.input.step = '1'
    }
    this.input.value = `${opts.value}`
    // 不展示值
    if (!opts.showValue) {
      this.addChild(this.input)
      this.input.addEventListener('change', () => {
        this.input.title = this.input.value
        if (opts.onChange) {
          opts.onChange(parseInt(this.input.value))
        }
      })
      return
    }
    // 展示值
    const text = opts.showValue ? new Text(`${opts.value}`) : undefined
    this.input.addEventListener('change', () => {
      this.input.title = this.input.value
      if (text) {
        text.setText(this.input.value)
      }
      if (opts.onChange) {
        opts.onChange(parseInt(this.input.value))
      }
    })
    if (!text) {
      this.addChild(this.input)
    } else {
      this.addChild(
        new HSplitBox({
          left: this.input,
          right: text,
          gap: rem(0.5),
          fixedSide: 'right'
        })
      )
    }
  }
  validate(): boolean {
    return true
  }
  setDisabled(disabled: boolean): void {
    this.input.disabled = disabled
  }
}
