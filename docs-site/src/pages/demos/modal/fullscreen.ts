import { Button, DivModule, showModal } from 'wok-ui'

/**
 * 全屏模态框：fullscreen 铺满整个窗口
 */
export default class ModalFullscreenDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new Button({
        text: 'Show Fullscreen Modal',
        onClick() {
          showModal({
            title: 'Fullscreen',
            fullscreen: true,
            body: 'This modal covers the entire window.'
          })
        }
      })
    )
  }
}
