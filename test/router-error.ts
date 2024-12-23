import { DivModule, LargeTitle, Spacer } from '../lib'
import { TestLayout } from './layout'

class Page extends DivModule {
  constructor(from: string, to: string, error: any) {
    super()
    document.title = '路由错误测试'
    const msg = error instanceof Error ? error.message : `${error}`
    this.addChild(
      new LargeTitle('路由导航发生错误'),
      new Spacer(),
      `从页面 ${from} 到页面 ${to} 的过程中发生了异常。`,
      new Spacer(),
      `错误信息：${msg}`
    )
  }
}

export function buildErrorPage(from: string, to: string, error: any) {
  return new TestLayout(new Page(from, to, error))
}
