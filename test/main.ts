import { initRouter } from '../lib'
import { notFound } from './404'
import { colorTest } from './color'
import { homePage } from './home'
import { initI18n } from './i18n'
import { i18nTest } from './i18n-test'
import { iconTest } from './icon'
import { textTest } from './text'

async function main() {
  await initI18n()
  initRouter({
    mode: 'hash',
    rules: [
      { path: '/', module: homePage },
      { path: 'i18n', module: i18nTest },
      { path: 'color', module: colorTest },
      { path: 'text', module: textTest },
      { path: 'icon', module: iconTest },
      // 使用动态导入，这样可以将不同的页面打包到不同的文件中，异步加载
      { path: 'button', module: () => import('./button').then(res => res.buttonTest()) },
      { path: 'message', module: () => import('./message').then(res => res.messageTest()) },
      { path: 'dropdown', module: () => import('./dropdown').then(res => res.dropdownTest()) },
      { path: 'table', module: () => import('./table').then(res => res.tableTest()) },
      { path: 'layout', module: () => import('./layout-test').then(res => res.layoutTest()) },
      { path: 'modal', module: () => import('./modal').then(res => res.modalTest()) },
      { path: 'drawer', module: () => import('./drawer').then(res => res.drawerTest()) },
      { path: 'form', module: () => import('./form').then(res => res.formTest()) },
      {
        path: 'full-rendering',
        module: () => import('./full-rendering').then(res => res.fullRenderingTest())
      },
      {
        path: 'responsive',
        module: () => import('./responsive').then(res => res.responsiveTest())
      },
      { path: 'router1', module: () => import('./router1').then(res => res.routerTest1()) },
      { path: 'router2', module: () => import('./router2').then(res => res.routerTest2()) },
      // 通过 cache 参数给路由加缓存，被缓存的页面切换再来的时候不会重新渲染
      {
        path: 'router3',
        module: () => import('./router3').then(res => res.routerTest3()),
        cache: true
      },
      // 通配页面，凡是找不到地址的，都将展示这个页面
      { path: '*', module: notFound }
    ]
  }).mount(document.body)
}

main().catch(console.error)
