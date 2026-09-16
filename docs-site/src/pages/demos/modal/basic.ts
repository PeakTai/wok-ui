import { Button, DivModule, showModal } from 'wok-ui'

/**
 * 基本模态框：标题 + 正文内容
 */
export default class ModalBasicDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new Button({
        text: 'Show Modal',
        onClick() {
          showModal({ title: 'Title', body: 'This is the content of the modal.' })
        }
      })
    )
  }
}
