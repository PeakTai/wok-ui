import { DivModule, LargeTitle, PrimaryBodyText, RouterLink, Spacer, getRouter } from '../lib'
import { TestLayout } from './layout'

class Page extends DivModule {
  constructor() {
    super()
    this.el.style.textAlign = 'center'
    const router = getRouter()
    this.addChild(
      new LargeTitle('404 未找到要访问的页面'),
      new Spacer(20),
      new PrimaryBodyText(`页面 ${router.getRouterInfo().path} 没有找到，请确定路径是否错误`),
      new Spacer(10),
      new RouterLink({ path: '/', content: '返回首页' })
    )
  }
}

export function notFound() {
  return new TestLayout(new Page())
}
