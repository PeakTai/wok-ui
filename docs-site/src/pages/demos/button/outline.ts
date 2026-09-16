import { Button, DivModule, HBox, rem } from 'wok-ui'

/**
 * 描边（镂空）样式按钮
 */
export default class ButtonOutlineDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new HBox({
        gap: rem(1),
        wrap: true,
        children: [
          new Button({ text: 'Primary', type: 'primary', outline: true }),
          new Button({ text: 'Danger', type: 'danger', outline: true }),
          new Button({ text: 'Warning', type: 'warning', outline: true }),
          new Button({ text: 'Success', type: 'success', outline: true })
        ]
      })
    )
  }
}
