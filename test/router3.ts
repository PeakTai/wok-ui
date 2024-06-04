import {
  Button,
  FullRenderingModule,
  HBox,
  LargeTitle,
  PrimaryBodyText,
  RouterLink,
  Spacer,
  getRouter,
  rem,
  showSuccess,
  showWarning
} from '../lib'
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
    }, 1000)
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
      new Spacer(),
      new PrimaryBodyText(
        `当前参数是：${JSON.stringify(
          getRouter().getRouterInfo().query
        )}，再次来到页面后将不会有 loading`
      ),
      new Spacer(),
      new PrimaryBodyText(
        '由于整个页面是缓存的，再次进入到当前页面将不会重新渲染，前提是参数相同，不同的参数缓存不复用'
      ),
      new Spacer(),
      new HBox({
        gap: rem(1),
        children: [
          new Button({
            text: '清除当前页面的缓存',
            onClick(ev) {
              getRouter().removeCurrentPageCache()
              showSuccess('清除成功，此时切换页面页面模块将被销毁')
            }
          }),
          new Button({
            text: '清除路径 /router3 下的缓存',
            onClick(ev) {
              getRouter().removeCacheByPath('router3')
              showSuccess('清除成功，所有 /router3 路径下缓存的页面将被销毁')
            }
          })
        ]
      }),
      new Spacer()
    )

    for (let i = 0; i < 100; i++) {
      this.addChild(
        `测试滚动位置，当前位置： ${i + 1} `,
        new RouterLink({ path: 'router1', content: '返回上层' }),
        new Spacer()
      )
    }
  }

  // 生命周期测试
  mount(parentEl: Element): void {
    super.mount(parentEl)
    showSuccess('路由页面完成挂载')
  }

  destroy(): void {
    super.destroy()
    showSuccess('路由页面销毁')
  }

  onPageHide() {
    showWarning('路由页面被隐藏')
  }

  onPageShow() {
    showSuccess('路由页面被显示')
  }
}

export function routerTest3() {
  return new TestLayout(new Page())
}
