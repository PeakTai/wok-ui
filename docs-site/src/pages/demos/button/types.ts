import { Button, DivModule, HBox, rem, showSuccess } from 'wok-ui'

/**
 * 不同用途的按钮
 */
export default class ButtonTypesDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new HBox({
        gap: rem(1),
        wrap: true,
        children: [
          new Button({
            text: 'Primary',
            type: 'primary',
            onClick() {
              showSuccess('Clicked')
            }
          }),
          new Button({ text: 'Default', type: 'default' }),
          new Button({ text: 'Danger', type: 'danger' }),
          new Button({ text: 'Warning', type: 'warning' }),
          new Button({ text: 'Success', type: 'success' })
        ]
      })
    )
  }
}
