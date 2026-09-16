import { Button, DivModule, HBox, RemoteSvgIcon, rem } from 'wok-ui'

/**
 * 不同大小的按钮
 */
export default class ButtonSizeDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new HBox({
        gap: rem(1),
        wrap: true,
        align: 'center',
        children: [
          new Button({ text: 'Large', size: 'lg' }),
          new Button({ text: 'Default' }),
          new Button({ text: 'Small', size: 'sm' }),
          new Button({
            text: 'Large Icon',
            size: 'lg',
            icon: new RemoteSvgIcon('/wok-ui/vendor/fontawesome-5.15.4/svgs/brands/chrome.svg')
          }),
          new Button({
            text: 'Small Icon',
            size: 'sm',
            icon: new RemoteSvgIcon('/wok-ui/vendor/fontawesome-5.15.4/svgs/brands/chrome.svg')
          })
        ]
      })
    )
  }
}
