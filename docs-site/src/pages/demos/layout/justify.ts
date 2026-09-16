import { DivModule, JustifyBox, createDomModule, getColor } from 'wok-ui'

/**
 * JustifyBox 两端对齐容器
 */
export default class LayoutJustifyDemo extends DivModule {
  constructor() {
    super()
    const colors = [getColor().primary, getColor().success, getColor().warning]
    this.addChild(
      new JustifyBox({
        align: 'center',
        children: ['Left', 'Center', 'Right'].map((text, i) =>
          createDomModule({
            style: {
              backgroundColor: colors[i],
              color: '#fff',
              padding: '0.5rem 1rem'
            },
            innerText: text
          })
        )
      })
    )
  }
}
