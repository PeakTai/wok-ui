import {
  DivModule,
  LargeTitle,
  PrimaryBodyText,
  SecondaryBodyText,
  SmallSecondaryBodyText,
  Spacer,
  Title,
  VBox,
  rem
} from 'wok-ui'

/**
 * 预设文本类型对比
 */
export default class TextPresetsDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new VBox({
        gap: rem(0.5),
        align: 'left',
        children: [
          new LargeTitle('Large Title'),
          new Title('Title'),
          new PrimaryBodyText('Primary body text for main content.'),
          new SecondaryBodyText('Secondary body text for less important content.'),
          new SmallSecondaryBodyText('Small secondary body text for tips and notes.')
        ]
      }),
      new Spacer()
    )
  }
}
