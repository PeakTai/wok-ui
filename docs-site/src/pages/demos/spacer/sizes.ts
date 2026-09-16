import {
  DivModule,
  HBox,
  HSpacer,
  SmallSecondaryBodyText,
  Spacer,
  createDomModule,
  getColor
} from 'wok-ui'

function block(width = '3rem', height = '1.5rem') {
  return createDomModule({
    style: { width, height, backgroundColor: getColor().primary }
  })
}

/**
 * Spacer 预设值与 HSpacer 水平间隙对比
 */
export default class SpacerSizesDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new SmallSecondaryBodyText("Spacer('sm') = 0.5rem"),
      new Spacer('sm'),
      block(),
      new Spacer('sm'),
      new SmallSecondaryBodyText("Spacer('normal') = 1rem"),
      new Spacer('sm'),
      block(),
      new Spacer(),
      new SmallSecondaryBodyText("Spacer('lg') = 2rem"),
      new Spacer('sm'),
      block(),
      new Spacer('lg'),
      new SmallSecondaryBodyText("Spacer(40) = 40px"),
      new Spacer('sm'),
      block(),
      new Spacer(40),
      block(),
      new Spacer(),
      new SmallSecondaryBodyText("HSpacer('sm') / HSpacer('normal') / HSpacer('lg')"),
      new Spacer('sm'),
      new HBox({
        children: [block(), new HSpacer('sm'), block(), new HSpacer('normal'), block(), new HSpacer('lg'), block()]
      })
    )
  }
}
