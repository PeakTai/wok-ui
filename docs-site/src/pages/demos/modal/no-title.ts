import { Button, DivModule, showModal } from 'wok-ui'

/**
 * 无标题的模态框：不传 title 时不显示标题栏
 */
export default class ModalNoTitleDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new Button({
        text: 'Show Modal',
        onClick() {
          showModal({ body: 'A modal without title.' })
        }
      })
    )
  }
}
