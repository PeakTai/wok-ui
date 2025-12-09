import { DivModule, H1, H2, H3, H4, H5, H6, Spacer } from '../lib'
import { TestLayout } from './layout'

class Page extends DivModule {
  constructor() {
    super()
    this.addChild(
      new H1('H1 一级标题'),
      new Spacer(),
      new H1({
        content: ['H1 一级标题', '主题色'],
        color: 'primary'
      }),
      new Spacer(),
      new H2('H2 二级标题'),
      new Spacer(),
      new H3('H3 三级标题'),
      new Spacer(),
      new H4('H4 四级标题'),
      new Spacer(),
      new H5('H5 五级标题'),
      new Spacer(),
      new H6('H6 六级标题')
    )
  }
}

export function headingTest() {
  return new TestLayout(new Page())
}
