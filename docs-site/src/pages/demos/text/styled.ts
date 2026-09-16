import { DivModule, HBox, Text, rem } from 'wok-ui'

/**
 * Text 语义色与自定义颜色
 */
export default class TextStyledDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new HBox({
        gap: rem(1),
        wrap: true,
        children: [
          new Text({ text: 'Primary', color: 'primary' }),
          new Text({ text: 'Warning', color: 'warning' }),
          new Text({ text: 'Success', color: 'success' }),
          new Text({ text: 'Danger', color: 'danger' }),
          new Text({ text: 'Custom #3df', color: '#3df' })
        ]
      })
    )
  }
}
