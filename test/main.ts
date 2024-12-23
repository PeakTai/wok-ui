import { getRouter, initRouter, showWarning } from '../lib'
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
      // 与钩子函数配合进行测试
      {
        path: 'router-error',
        module: () => import('./router-error').then(res => res.routerError())
      },
      // 通配页面，凡是找不到地址的，都将展示这个页面
      { path: '*', module: notFound }
    ],
    // 钩子测试
    hooks: {
      async beforeEach(to, from) {
        console.log('路由导航开始', to, from)
        // 如果路由是 router 4 则拦截，测试阻止导航和异常的处理
        if (to.path === 'router4' || to.path === '/router4') {
          if (to.query && to.query['error']) {
            throw to.query['error'] as string
          } else {
            showWarning('导航中止，页面不会变化，但是地址会变化')
            return false
          }
        }
        return true
      },
      afterEach(to, from, isSuccess) {
        console.log('导航结束', isSuccess, to, from)
      },
      errorHandler(error, to, from) {
        showWarning('路由导航发生错误，重新导航到错误展示页面')
        console.log('to = ', to)
        console.log('from = ', from)
        console.log(error)
        // 转到展示页面
        const msg = error instanceof Error ? error.message || error.stack : `${error}`
        getRouter().replace({ path: 'router-error', query: { msg: msg || '' } })
      }
    }
  }).mount(document.body)
}

main().catch(console.error)
