import { DivModule, Grid, createDomModule, getColor, rem } from 'wok-ui'

/**
 * Grid 三列网格
 */
export default class LayoutGridDemo extends DivModule {
  constructor() {
    super()
    const colors = [getColor().primary, getColor().success, getColor().warning, getColor().danger]
    this.addChild(
      new Grid({
        cols: 3,
        gap: rem(1),
        cells: [...new Array(9).keys()].map(idx =>
          createDomModule({
            style: {
              backgroundColor: colors[idx % colors.length],
              color: '#fff',
              padding: '1rem'
            },
            innerText: `Cell ${idx + 1}`
          })
        )
      })
    )
  }
}
