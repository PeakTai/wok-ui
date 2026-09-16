import { Button, DivModule, showModal } from 'wok-ui'

/**
 * 自定义脚部内容的模态框
 */
export default class ModalFooterDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new Button({
        text: 'Show Modal',
        onClick() {
          showModal({
            title: 'Title',
            body: 'Body content',
            footer: {
              style: {
                padding: '1rem',
                borderTop: '1px dashed grey'
              },
              innerText: 'Custom footer content'
            }
          })
        }
      })
    )
  }
}
