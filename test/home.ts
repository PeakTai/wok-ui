import { DivModule, HBox, LargeTitle, RouterLink, Spacer } from '../lib'
import { TestLayout } from './layout'

class Page extends DivModule {
  constructor() {
    super()
    this.addChild(
      new LargeTitle('wok-ui 功能测试和演示'),
      new Spacer(20),
      new HBox({
        gap: 16,
        wrap: true,
        children: [
          new RouterLink({ path: 'i18n', content: '国际化' }),
          new RouterLink({ path: 'color', content: '颜色' }),
          new RouterLink({ path: 'text', content: '文本' }),
          new RouterLink({ path: 'icon', content: '图标' }),
          new RouterLink({ path: 'button', content: '按钮' }),
          new RouterLink({ path: 'message', content: '消息提示' }),
          new RouterLink({ path: 'dropdown', content: '下拉框' }),
          new RouterLink({ path: 'table', content: '表格' }),
          new RouterLink({ path: 'layout', content: '布局' }),
          new RouterLink({ path: 'modal', content: '模态框' }),
          new RouterLink({ path: 'drawer', content: '抽屉' }),
          new RouterLink({ path: 'form', content: '表单' }),
          new RouterLink({ path: 'full-rendering', content: '全量渲染' }),
          new RouterLink({ path: 'responsive', content: '响应式渲染' }),
          new RouterLink({ path: 'router1', content: '路由测试' }),
          new RouterLink({ path: '/not-found/xxx', content: '404页面' })
        ]
      })
    )
  }
}

export function homePage() {
  return new TestLayout(new Page())
}
