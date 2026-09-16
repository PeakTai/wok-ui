import {
  Button,
  FullRenderingModule,
  HBox,
  PrimaryBodyText,
  Spacer,
  createDomModule,
  getColor,
  rem,
  resetColor,
  setColor
} from 'wok-ui'

function generateRandomColor(): string {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
    .toString(16)
    .padStart(2, '0')}`
}

/**
 * 随机更改主题色并恢复默认
 */
export default class ColorCustomizeDemo extends FullRenderingModule {
  constructor() {
    super()
    this.render()
  }

  protected buildContent(): void {
    const color = getColor()
    const entries: Array<[string, string]> = [
      ['primary', color.primary],
      ['danger', color.danger],
      ['success', color.success],
      ['warning', color.warning]
    ]
    this.addChild(
      ...entries.map(([name, value]) =>
        createDomModule({
          style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
          children: [
            createDomModule({
              style: { width: '3rem', height: '1.5rem', backgroundColor: value }
            }),
            new PrimaryBodyText(name)
          ]
        })
      ),
      new Spacer('sm'),
      new HBox({
        gap: rem(1),
        children: [
          new Button({
            text: 'Randomize',
            type: 'primary',
            onClick: () => {
              setColor({
                primary: generateRandomColor(),
                danger: generateRandomColor(),
                warning: generateRandomColor(),
                success: generateRandomColor()
              })
              this.render()
            }
          }),
          new Button({
            text: 'Reset',
            onClick: () => {
              resetColor()
              this.render()
            }
          })
        ]
      })
    )
  }

  destroy(): void {
    // 页面卸载时恢复默认颜色，避免影响整站
    resetColor()
    super.destroy()
  }
}
