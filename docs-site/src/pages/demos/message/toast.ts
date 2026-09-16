import { Button, DivModule, HBox, rem, showSuccess, showToast, showWarning } from 'wok-ui'

/**
 * 弹出式消息：警告、成功以及自定义持续时间的 Toast
 */
export default class MessageToastDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new HBox({
        gap: rem(1),
        wrap: true,
        children: [
          new Button({
            text: 'Show Warning',
            type: 'warning',
            outline: true,
            onClick() {
              showWarning('This is a warning message')
            }
          }),
          new Button({
            text: 'Show Success',
            type: 'success',
            outline: true,
            onClick() {
              showSuccess('Operation succeeded')
            }
          }),
          new Button({
            text: 'Custom Duration',
            type: 'success',
            outline: true,
            onClick() {
              showToast({
                type: 'success',
                text: 'I will disappear after 5 seconds',
                duration: 5000
              })
            }
          })
        ]
      })
    )
  }
}
