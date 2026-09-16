import { Button, DivModule, showDrawer } from 'wok-ui'

/**
 * 无标题抽屉
 */
export default class DrawerNoTitleDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new Button({
        text: 'Open',
        onClick() {
          showDrawer({
            placement: 'right',
            body: 'This drawer has no title bar.'
          })
        }
      })
    )
  }
}
