import { Button, DivModule, HBox, hideLoading, rem, showLoading } from 'wok-ui'

/**
 * 全屏 Loading：无文字与带文字两种形式，1.5 秒后自动关闭
 */
export default class MessageLoadingDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new HBox({
        gap: rem(1),
        wrap: true,
        children: [
          new Button({
            text: 'Show Loading',
            onClick() {
              showLoading()
              setTimeout(hideLoading, 1500)
            }
          }),
          new Button({
            text: 'Loading with Text',
            onClick() {
              showLoading('Loading...')
              setTimeout(hideLoading, 1500)
            }
          })
        ]
      })
    )
  }
}
