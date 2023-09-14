import { getColor } from '../color'
import { DivModule } from '../module'

/**
 * 输入无效的反馈信息
 */
export class InvalidFeedback extends DivModule {
  constructor(errMsg: string) {
    super()
    this.el.classList.add('invalid-feedback')
    this.el.innerText = errMsg
    this.el.style.paddingTop = '0.5rem'
    this.el.style.lineHeight = '1'
    this.el.style.color = getColor().danger
  }
}
