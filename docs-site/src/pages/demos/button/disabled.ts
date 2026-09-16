import { Button, DivModule, HBox, rem } from 'wok-ui'

/**
 * 禁用状态按钮
 */
export default class ButtonDisabledDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new HBox({
        gap: rem(1),
        wrap: true,
        children: [
          new Button({ text: 'Primary', type: 'primary', disabled: true }),
          new Button({ text: 'Default', disabled: true }),
          new Button({ text: 'Danger', type: 'danger', disabled: true }),
          new Button({ text: 'Warning', type: 'warning', disabled: true }),
          new Button({ text: 'Success', type: 'success', disabled: true })
        ]
      })
    )
  }
}
