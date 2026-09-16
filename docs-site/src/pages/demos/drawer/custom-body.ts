import { Button, DivModule, rem, showDrawer } from 'wok-ui'

/**
 * 完全自定义抽屉内容
 */
export default class DrawerCustomBodyDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new Button({
        text: 'Open',
        onClick() {
          const drawer = showDrawer({
            placement: 'right',
            replaceByBody: true,
            body: {
              style: {
                background: 'white',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'center',
                justifyContent: 'center'
              },
              children: [
                'Fully customized content here.',
                rem(1),
                new Button({
                  text: 'Close',
                  onClick: () => drawer.close()
                })
              ]
            }
          })
        }
      })
    )
  }
}
