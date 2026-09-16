import { Button, DivModule, HBox, rem, showAlert, showConfirm, showSuccess, showWarning } from 'wok-ui'

/**
 * 对话框消息：showAlert 强制确认与 showConfirm 确认/取消选择
 */
export default class MessageDialogDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new HBox({
        gap: rem(1),
        wrap: true,
        children: [
          new Button({
            text: 'Show Alert',
            type: 'warning',
            outline: true,
            onClick() {
              showAlert('Something went wrong. Please confirm to continue.')
                .then(() => {
                  showSuccess('Confirmed, let us move on')
                })
                .catch(showWarning)
            }
          }),
          new Button({
            text: 'Show Confirm',
            type: 'warning',
            outline: true,
            onClick() {
              showConfirm('Are you sure you want to continue?')
                .then(res => {
                  if (res) {
                    showSuccess('You chose to continue')
                  } else {
                    showSuccess('You chose to cancel')
                  }
                })
                .catch(showWarning)
            }
          })
        ]
      })
    )
  }
}
