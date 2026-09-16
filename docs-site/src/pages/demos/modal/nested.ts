import { Button, DivModule, Link, showModal, showWarning } from 'wok-ui'

/**
 * 多层嵌套模态框
 */
export default class ModalNestedDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new Button({
        text: 'Show Modal',
        onClick() {
          showModal({
            title: 'First Level',
            width: 800,
            body: new Link({
              content: 'Click to open the second level',
              onClick() {
                showModal({
                  title: 'Second Level',
                  width: 500,
                  body: 'Avoid nesting too many modals in real development.',
                  onClose: () => showWarning('Second level closed')
                })
              }
            }),
            onClose: () => showWarning('First level closed')
          })
        }
      })
    )
  }
}
