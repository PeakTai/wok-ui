import { Button, DivModule, showDrawer } from 'wok-ui'

/**
 * 多抽屉叠加
 */
export default class DrawerStackedDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new Button({
        text: 'Open',
        onClick() {
          showDrawer({
            title: 'First Drawer',
            placement: 'right',
            body: new Button({
              text: 'Open Another',
              onClick() {
                showDrawer({
                  title: 'Second Drawer',
                  placement: 'left',
                  body: 'Clicking the backdrop closes the drawers one by one in reverse order.'
                })
              }
            })
          })
        }
      })
    )
  }
}
