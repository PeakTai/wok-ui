import { TextInput, TextInputOpts } from './text'
import './color.less'

/**
 * 颜色输入框
 */
export class ColorInput extends TextInput {
  constructor(
    colorOpts: Omit<TextInputOpts, 'maxLength' | 'minLength' | 'placeholder' | 'onBlur'>
  ) {
    super(colorOpts)
    this.input.type = 'color'
  }
}
