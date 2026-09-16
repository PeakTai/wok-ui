import { Button, DivModule, showDrawer } from 'wok-ui'

/**
 * 自定义宽度的抽屉
 */
export default class DrawerWidthDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new Button({
        text: 'Open',
        onClick() {
          showDrawer({
            title: 'Custom Width',
            width: 300,
            placement: 'right',
            body: 'This drawer has a custom width of 300px.'
          })
        }
      })
    )
  }
}
