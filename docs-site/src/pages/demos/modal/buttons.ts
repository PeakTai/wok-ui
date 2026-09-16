import { Button, DivModule, showModal, showSuccess, showWarning } from 'wok-ui'

/**
 * 带确认/取消按钮的模态框：onConfirm 不会自动关闭，需手动调用 close
 */
export default class ModalButtonsDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new Button({
        text: 'Show Modal',
        onClick() {
          const modal = showModal({
            title: 'Confirm Operation',
            body: 'This is the content of the modal.',
            buttons: { confirm: true, cancel: 'Quit' },
            staticBackDrop: true,
            onConfirm() {
              showSuccess('Confirm clicked')
              // onConfirm 不会自动关闭模态框，需要手动调用 close
              modal.close()
            },
            onClose() {
              showWarning('Modal closed')
            }
          })
        }
      })
    )
  }
}
