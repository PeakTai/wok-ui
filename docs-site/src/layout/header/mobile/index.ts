import { DivModule } from 'wok-ui'
import { showContextMenu } from 'wok-ui-ext'
import { getDocsI18n } from '../../../i18n'
import { FontAwesomeIcon } from '../../font-awesome'
import { ThemeManager } from '../../theme'
import { openSearchModal } from '../../search-modal'
import { buildLangMenuItems } from '../header-common'
import '../style.less'
import './style.less'

export interface MobileHeaderOpts {
  /** 当前语言 */
  lang: string
  /** 主题管理器，提供主题选择菜单 */
  themeManager: ThemeManager
  /** 切换语言回调 */
  switchLang: (targetLang: string) => void
  /** 打开/关闭侧边抽屉菜单 */
  toggleMenu: () => void
}

/**
 * 移动端头部：站点标题（左）+ 搜索 / 文档树 / "更多"菜单（右）。
 * 与 PcHeader 同时挂载，由 CSS 控制仅移动端显示。
 */
export class MobileHeader extends DivModule {
  constructor(private readonly opts: MobileHeaderOpts) {
    super('docs-header-mobile')
    const docsI18n = getDocsI18n()

    // 左侧：站点标题
    this.addChild({
      tag: 'div',
      classNames: 'docs-header-left',
      children: [
        {
          tag: 'a',
          classNames: 'docs-header-title',
          // BASE_URL 兼容子路径部署（如 GitHub Pages /wok-ui/）
          attrs: { href: import.meta.env.BASE_URL + `${opts.lang}/index.html` },
          innerText: 'wok-ui'
        }
      ]
    })

    // 右侧：搜索 + 文档树抽屉 + 更多菜单
    this.addChild({
      tag: 'div',
      classNames: 'docs-header-right',
      children: [
        // 搜索
        {
          tag: 'div',
          classNames: 'docs-header-action',
          onClick: (e: MouseEvent) => {
            e.stopPropagation()
            void openSearchModal(opts.lang)
          },
          children: [new FontAwesomeIcon({ iconClass: 'fa-search' })]
        },
        // 文档树抽屉
        {
          tag: 'div',
          classNames: 'docs-header-action',
          onClick: () => opts.toggleMenu(),
          children: [new FontAwesomeIcon({ iconClass: 'fa-sitemap' })]
        },
        // 更多菜单
        {
          tag: 'div',
          classNames: 'docs-header-action',
          onClick: (e: MouseEvent) => {
            e.stopPropagation()
            this.showMoreMenu(e)
          },
          children: [new FontAwesomeIcon({ iconClass: 'fa-ellipsis-v' })]
        }
      ]
    })
  }

  /** 移动端"更多"菜单：主题 / 语言 / GitHub */
  private showMoreMenu(e: MouseEvent): void {
    const docsI18n = getDocsI18n()
    const { lang, themeManager, switchLang } = this.opts
    showContextMenu({
      evt: e,
      position: 'bottom',
      align: 'end',
      menu: [
        {
          icon: 'fas fa-palette',
          label: docsI18n.buildMsg('docs-theme-toggle-title'),
          children: themeManager.buildThemeMenuItems()
        },
        {
          icon: 'fas fa-globe',
          label: docsI18n.buildMsg('docs-lang-label'),
          children: buildLangMenuItems({ lang, switchLang })
        },
        {
          icon: 'fas fa-code',
          label: 'GitHub',
          callback: () => window.open('https://github.com/PeakTai/wok-ui', '_blank')
        }
      ]
    })
  }
}
