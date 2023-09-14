import { TextInput, TextInputOpts } from './text'

/**
 * 号码输入框，唯一的作用就是在可以让移动端弹出数字键盘，方便输入电话号码
 */
export class TelInput extends TextInput {
  constructor(opts: TextInputOpts) {
    super(opts)
    this.input.type = 'tel'
  }
}
