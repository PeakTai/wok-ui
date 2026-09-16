import { DivModule, HBox, createDomModule, getColor, rem } from 'wok-ui'

/**
 * HBox 水平堆叠容器，允许换行
 */
export default class LayoutHBoxDemo extends DivModule {
  constructor() {
    super()
    const colors = [getColor().primary, getColor().success, getColor().warning, getColor().danger]
    this.addChild(
      new HBox({
        gap: rem(1),
        wrap: true,
        children(addChild) {
          for (let i = 0; i < 16; i++) {
            addChild(
              createDomModule({
                style: {
                  backgroundColor: colors[i % colors.length],
                  color: '#fff',
                  padding: '0.5rem 1rem'
                },
                innerText: `Item ${i + 1}`
              })
            )
          }
        }
      })
    )
  }
}
