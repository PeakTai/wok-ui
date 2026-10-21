import { DivModule, SearchInput } from 'wok-ui'
import { showContextMenu } from 'wok-ui-ext'
import { getDocsI18n } from '../../../i18n'
import { FontAwesomeIcon } from '../../font-awesome'
import { ThemeManager } from '../../theme'
import { openSearchModal } from '../../search-modal'
import { buildLangMenuItems } from '../header-common'
import '../style.less'
import './style.less'

export interface PcHeaderOpts {
  /** 当前语言 */
  lang: string
  /** 主题管理器，提供主题选择菜单 */
  themeManager: ThemeManager
  /** 切换语言回调 */
  switchLang: (targetLang: string) => void
}

/**
 * PC 端头部：标题 + 搜索框 + 主题切换 + 语言切换 + GitHub。
 * 与 MobileHeader 同时挂载，由 CSS 控制仅 PC 端显示。
 */
export class PcHeader extends DivModule {
  constructor(private readonly opts: PcHeaderOpts) {
    super('docs-header-pc')
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

    // 中间：搜索框（点击打开搜索弹窗）
    this.addChild({
      tag: 'div',
      classNames: 'docs-header-center',
      children: [
        {
          tag: 'div',
          classNames: 'docs-search-trigger',
          events: {
            // 阻止 input 获得焦点，避免闪烁；点击统一打开搜索弹窗
            mousedown: (e: Event) => e.preventDefault(),
            click: () => void openSearchModal(opts.lang)
          },
          children: new SearchInput({
            placeholder: docsI18n.buildMsg('docs-search-placeholder')
          })
        }
      ]
    })

    // 右侧：主题切换 + 语言切换 + GitHub
    this.addChild({
      tag: 'div',
      classNames: 'docs-header-right',
      children: [
        // 主题切换
        {
          tag: 'div',
          classNames: 'docs-header-theme',
          onClick: (e: MouseEvent) => {
            e.stopPropagation()
            opts.themeManager.showThemeMenu(e)
          },
          children: [
            new FontAwesomeIcon({
              iconClass: 'fa-palette',
              title: docsI18n.buildMsg('docs-theme-toggle-title')
            }),
            docsI18n.buildMsg('docs-theme-label')
          ]
        },
        // 语言切换
        {
          tag: 'div',
          classNames: 'docs-header-theme',
          onClick: (e: MouseEvent) => {
            e.stopPropagation()
            showContextMenu({
              evt: e,
              position: 'bottom',
              align: 'end',
              menu: buildLangMenuItems({ lang: opts.lang, switchLang: opts.switchLang })
            })
          },
          children: [
            new FontAwesomeIcon({
              iconClass: 'fa-globe'
            }),
            docsI18n.buildMsg('docs-lang-label')
          ]
        },
        // GitHub
        {
          tag: 'a',
          classNames: 'docs-header-theme',
          attrs: {
            href: 'https://github.com/PeakTai/wok-ui',
            target: '_blank',
            rel: 'noopener noreferrer'
          },
          children: [
            new FontAwesomeIcon({
              iconClass: 'fa-code'
            }),
            'GitHub'
          ]
        }
      ]
    })
  }
}
