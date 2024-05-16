import { DivModule } from '../module';
export class InvalidFeedback extends DivModule {
  constructor(errMsg: string) {
    super('invalid-feedback')
    this.el.innerText = errMsg
  }
}
