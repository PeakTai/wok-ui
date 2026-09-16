import { Button, DivModule, showModal, showSuccess, showWarning } from 'wok-ui'

/**
 * 自定义按钮数组的模态框
 */
export default class ModalCustomButtonsDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new Button({
        text: 'Show Modal',
        onClick() {
          const modal = showModal({
            title: 'Submit',
            body: 'Choose an action below to continue.',
            staticBackDrop: true,
            buttons: [
              new Button({
                text: 'Publish',
                type: 'primary',
                onClick() {
                  modal.close()
                  showSuccess('Publish clicked')
                }
              }),
              new Button({
                text: 'Save Draft',
                type: 'default',
                onClick() {
                  modal.close()
                  showSuccess('Save Draft clicked')
                }
              }),
              new Button({
                text: 'Discard',
                type: 'warning',
                onClick() {
                  modal.close()
                  showWarning('Discard clicked')
                }
              })
            ]
          })
        }
      })
    )
  }
}
