import { Button, DivModule, showDrawer } from 'wok-ui'

/**
 * 通过句柄关闭抽屉
 */
export default class DrawerHandleCloseDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new Button({
        text: 'Open',
        onClick() {
          const drawer = showDrawer({
            title: 'Close by Handle',
            placement: 'right',
            body: new Button({
              text: 'Close Drawer',
              type: 'warning',
              onClick() {
                drawer.close()
              }
            })
          })
        }
      })
    )
  }
}
