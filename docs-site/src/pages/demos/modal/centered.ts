import { Button, DivModule, showModal } from 'wok-ui'

/**
 * 对话框垂直居中显示的模态框
 */
export default class ModalCenteredDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new Button({
        text: 'Show Modal',
        onClick() {
          showModal({
            dialogCentered: true,
            title: 'Centered',
            body: 'The dialog is vertically centered.'
          })
        }
      })
    )
  }
}
