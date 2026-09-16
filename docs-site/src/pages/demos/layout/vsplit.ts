import { DivModule, VSplitBox, createDomModule, getColor } from 'wok-ui'

/**
 * VSplitBox 纵向分隔，顶部固定
 */
export default class LayoutVSplitDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new VSplitBox({
        height: 240,
        fixedSide: 'top',
        top: createDomModule({
          style: {
            backgroundColor: getColor().textSecondary,
            color: '#fff',
            padding: '0.5rem 1rem'
          },
          innerText: 'Fixed top'
        }),
        bottom: createDomModule({
          style: {
            backgroundColor: getColor().primary,
            color: '#fff',
            padding: '0.5rem 1rem'
          },
          innerText: 'Fill the rest'
        })
      })
    )
  }
}
