import { TextInput, TextInputOpts } from './text'

/**
 * 密码输入框，输入时不显示内容
 */
export class PasswordInput extends TextInput {
  constructor(opts: TextInputOpts) {
    super(opts)
    this.input.type = 'password'
  }
}
