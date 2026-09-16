import { Button, DivModule, showModal } from 'wok-ui'

/**
 * 静态背景模态框：点击背景无法关闭
 */
export default class ModalStaticBackdropDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new Button({
        text: 'Show Modal',
        onClick() {
          showModal({
            title: 'Static Backdrop',
            staticBackDrop: true,
            body: 'Clicking the backdrop will not close this modal.'
          })
        }
      })
    )
  }
}
