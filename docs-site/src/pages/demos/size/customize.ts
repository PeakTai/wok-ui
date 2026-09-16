import {
  Button,
  FullRenderingModule,
  HBox,
  H1,
  PrimaryBodyText,
  SmallSecondaryBodyText,
  Spacer,
  rem,
  resetSize,
  setSize
} from 'wok-ui'

/**
 * 自定义字号并恢复默认
 */
export default class SizeCustomizeDemo extends FullRenderingModule {
  constructor() {
    super()
    this.render()
  }

  protected buildContent(): void {
    this.addChild(
      new H1('Heading'),
      new Spacer('sm'),
      new PrimaryBodyText('Primary body text changes with the text size.'),
      new Spacer('sm'),
      new SmallSecondaryBodyText('Small secondary body text.'),
      new Spacer(),
      new HBox({
        gap: rem(1),
        children: [
          new Button({
            text: 'Randomize',
            type: 'primary',
            onClick: () => {
              const size = 12 + Math.floor(Math.random() * 12)
              setSize({
                text: size,
                textSm: size - 2,
                textLg: size + 2,
                textXl: size + 4
              })
              this.render()
            }
          }),
          new Button({
            text: 'Reset',
            onClick: () => {
              resetSize()
              this.render()
            }
          })
        ]
      })
    )
  }

  destroy(): void {
    // 页面卸载时恢复默认尺寸，避免影响整站
    resetSize()
    super.destroy()
  }
}
