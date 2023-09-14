import { DivModule, LargeTitle, PrimaryBodyText, Spacer } from '../lib'
import { TestLayout } from './layout'

class Page extends DivModule {
  constructor() {
    super()
    this.addChild(
      new LargeTitle('路由跳转测试'),
      new Spacer(),
      new PrimaryBodyText(
        '如果是从上个页面以替换的方式进入当前页面，相当于当前页面替代了上个页面，回退将会退回到上上个页面'
      )
    )
  }
}

export function routerTest2() {
  return new TestLayout(new Page())
}
