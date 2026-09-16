import { Button, DivModule, HBox, rem, showDrawer } from 'wok-ui'

/**
 * 四个方向弹出的抽屉
 */
export default class DrawerPlacementDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new HBox({
        gap: rem(1),
        wrap: true,
        children: [
          new Button({
            text: 'Left',
            onClick() {
              showDrawer({
                title: 'Left Drawer',
                placement: 'left',
                body: 'This drawer slides in from the left.'
              })
            }
          }),
          new Button({
            text: 'Right',
            onClick() {
              showDrawer({
                title: 'Right Drawer',
                placement: 'right',
                body: 'This drawer slides in from the right.'
              })
            }
          }),
          new Button({
            text: 'Top',
            onClick() {
              showDrawer({
                title: 'Top Drawer',
                placement: 'top',
                body: 'This drawer slides in from the top.'
              })
            }
          }),
          new Button({
            text: 'Bottom',
            onClick() {
              showDrawer({
                title: 'Bottom Drawer',
                placement: 'bottom',
                body: 'This drawer slides in from the bottom.'
              })
            }
          })
        ]
      })
    )
  }
}
