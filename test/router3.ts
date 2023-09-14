import { FullRenderingModule, LargeTitle, PrimaryBodyText, Spacer, getRouter } from '../lib'
import { TestLayout } from './layout'

class Page extends FullRenderingModule {
  private loading = false

  constructor() {
    super()
    this.loading = true
    this.render()
    setTimeout(() => {
      this.loading = false
      this.render()
    }, 3000)
  }

  protected buildContent(): void {
    if (this.loading) {
      this.addChild(
        new LargeTitle('路由缓存测试'),
        new Spacer(),
        new PrimaryBodyText(`loading...`),
        new Spacer(),
        new PrimaryBodyText(
          `仅第一次来到页面会看到 loading ，当前参数是：${JSON.stringify(
            getRouter().getRouterInfo().query
          )}`
        )
      )
      return
    }
    this.addChild(
      new LargeTitle('路由缓存测试'),
      new Spacer(),
      new PrimaryBodyText(
        `当前参数是：${JSON.stringify(
          getRouter().getRouterInfo().query
        )}，再次来到页面后将不会有 loading`
      ),
      new Spacer(),
      new PrimaryBodyText(
        '由于整个页面是缓存的，再次进入到当前页面将不会重新渲染，前提是参数相同，不同的参数缓存不复用'
      )
    )
  }
}

export function routerTest3() {
  return new TestLayout(new Page())
}
