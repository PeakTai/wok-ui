import { DivModule, HSplitBox, createDomModule, getColor } from 'wok-ui'

/**
 * HSplitBox 横向分隔，左侧固定 150px
 */
export default class LayoutHSplitDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new HSplitBox({
        fixedSide: 'left',
        align: 'stretch',
        left: createDomModule({
          style: {
            backgroundColor: getColor().textSecondary,
            color: '#fff',
            padding: '1rem',
            width: '150px'
          },
          innerText: 'Fixed 150px'
        }),
        right: createDomModule({
          style: {
            backgroundColor: getColor().primary,
            color: '#fff',
            padding: '1rem'
          },
          innerText: 'Fill the rest'
        })
      })
    )
  }
}
