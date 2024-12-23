import { DivModule, LargeTitle, RouterLink, Spacer } from '../lib'
import { TestLayout } from './layout'

class Page extends DivModule {
  constructor() {
    super()
    this.addChild(
      new LargeTitle('路由跳转测试'),
      new Spacer(),
      new RouterLink({
        path: 'router2',
        replace: true,
        content: '替换的方式进入下个页面，后退不会再回到这个页面'
      }),
      new Spacer(),
      new RouterLink({
        path: 'router3',
        query: { q: '1' },
        content: '进入设置了缓存的页面，参数 q=1'
      }),
      new Spacer(),
      new RouterLink({
        path: 'router3',
        query: { q: '2' },
        content: '进入设置了缓存的页面，参数 q=2'
      }),
      new Spacer(),
      new RouterLink({
        path: '/router4',
        content: '跳转将阻止跳转的页面地址'
      }),
      new Spacer(),
      new RouterLink({
        path: 'router4',
        query: { error: '专为测试路由导航的错误' },
        content: '跳转路由导航将会发生错误的页面'
      })
    )
  }
}

export function routerTest1() {
  return new TestLayout(new Page())
}
