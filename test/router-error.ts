import { DivModule, FullRenderingModule, getRouter, LargeTitle, Spacer } from '../lib'
import { TestLayout } from './layout'

class Page extends DivModule {
  constructor() {
    super()
    document.title = '路由错误测试'
    this.addChild(
      new LargeTitle('路由导航发生错误'),
      new Spacer(),
      `如果来到这个页面，就表明路由导航过程中发生了错误`,
      new Spacer(),
      `错误信息：${getRouter().getParam('msg')}`
    )
  }
}

export function routerError() {
  return new TestLayout(new Page())
}
