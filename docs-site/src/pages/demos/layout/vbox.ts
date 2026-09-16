import { DivModule, VBox, createDomModule, getColor, rem } from 'wok-ui'

/**
 * VBox 垂直堆叠容器
 */
export default class LayoutVBoxDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new VBox({
        gap: rem(0.5),
        align: 'left',
        children: ['A', 'B', 'C', 'D', 'E'].map((text, i) =>
          createDomModule({
            style: {
              backgroundColor: i % 2 === 0 ? getColor().primary : getColor().success,
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
