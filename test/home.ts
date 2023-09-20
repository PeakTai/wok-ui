import { DivModule, HBox, LargeTitle, RouterLink, Spacer } from '../lib'
import { getExtI18n } from './i18n'
import { TestLayout } from './layout'

class Page extends DivModule {
  constructor() {
    const i18n = getExtI18n()
    super()
    this.addChild(
      new LargeTitle('wok-ui 功能测试和演示'),
      new Spacer(20),
      new HBox({
        gap: 16,
        wrap: true,
        children: [
          new RouterLink({ path: 'i18n', content: i18n.buildMsg('internationalization') }),
          new RouterLink({ path: 'color', content: i18n.buildMsg('color') }),
          new RouterLink({ path: 'text', content: i18n.buildMsg('text') }),
          new RouterLink({ path: 'icon', content: i18n.buildMsg('icon') }),
          new RouterLink({ path: 'button', content: i18n.buildMsg('button') }),
          new RouterLink({ path: 'message', content: i18n.buildMsg('message') }),
          new RouterLink({ path: 'dropdown', content: i18n.buildMsg('dropdown') }),
          new RouterLink({ path: 'table', content: i18n.buildMsg('table') }),
          new RouterLink({ path: 'layout', content: i18n.buildMsg('layout') }),
          new RouterLink({ path: 'modal', content: i18n.buildMsg('modal') }),
          new RouterLink({ path: 'drawer', content: i18n.buildMsg('drawer') }),
          new RouterLink({ path: 'form', content: i18n.buildMsg('form') }),
          new RouterLink({ path: 'full-rendering', content: i18n.buildMsg('fullRendering') }),
          new RouterLink({ path: 'responsive', content: i18n.buildMsg('responsive') }),
          new RouterLink({ path: 'router1', content: i18n.buildMsg('routerTest') }),
          new RouterLink({ path: '/not-found/xxx', content: i18n.buildMsg('page404') })
        ]
      })
    )
  }
}

export function homePage() {
  return new TestLayout(new Page())
}
