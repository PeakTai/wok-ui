import { DivModule, H1, H2, H3, H4, H5, H6, Spacer } from 'wok-ui'

/**
 * H1-H6 六级标题
 */
export default class TextHeadingsDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new H1('H1 Heading'),
      new Spacer('sm'),
      new H2('H2 Heading'),
      new Spacer('sm'),
      new H3('H3 Heading'),
      new Spacer('sm'),
      new H4('H4 Heading'),
      new Spacer('sm'),
      new H5('H5 Heading'),
      new Spacer('sm'),
      new H6('H6 Heading')
    )
  }
}
