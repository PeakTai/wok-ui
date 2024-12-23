import { DivModule, LargeTitle, Spacer } from '../lib'
import { TestLayout } from './layout'

class Page extends DivModule {
  constructor(from: string, to: string) {
    super()
    document.title = '路由拦截-无权限测试'
    this.addChild(
      new LargeTitle('路由导航因为无权限被拦截'),
      new Spacer(),
      `从页面 ${from} 到页面 ${to} 被禁止。`
    )
  }
}

export function buildForbiddenPage(from: string, to: string) {
  return new TestLayout(new Page(from, to))
}
