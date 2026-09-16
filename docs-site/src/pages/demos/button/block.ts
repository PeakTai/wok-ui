import { Button, DivModule, RemoteSvgIcon, Spacer } from 'wok-ui'

/**
 * 块级按钮
 */
export default class ButtonBlockDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new Button({ text: 'Block Button', size: 'lg', block: true }),
      new Spacer('sm'),
      new Button({
        text: 'Block Button With Icon',
        size: 'lg',
        block: true,
        icon: new RemoteSvgIcon('/wok-ui/vendor/fontawesome-5.15.4/svgs/brands/firefox.svg')
      })
    )
  }
}
