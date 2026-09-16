import { DivModule, SmallSecondaryBodyText, createDomModule, getColor } from 'wok-ui'

/**
 * 当前主题色板
 */
export default class ColorPaletteDemo extends DivModule {
  constructor() {
    super()
    const color = getColor()
    const entries: Array<[string, string]> = [
      ['primary', color.primary],
      ['danger', color.danger],
      ['success', color.success],
      ['warning', color.warning],
      ['border', color.border],
      ['text', color.text],
      ['textSecondary', color.textSecondary],
      ['outline', color.outline]
    ]
    this.addChild(
      entries.map(([name, value]) =>
        createDomModule({
          style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
          children: [
            createDomModule({
              style: {
                width: '3rem',
                height: '1.5rem',
                backgroundColor: value,
                border: `1px solid ${color.border}`
              }
            }),
            new SmallSecondaryBodyText(`${name}: ${value}`)
          ]
        })
      )
    )
  }
}
