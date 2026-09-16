import { ResponsiveModule, ResponsiveSize, SubModulesOpt } from 'wok-ui'
import type { FontAwesomeIconClass } from './font-awesome'
import { FontAwesomeIcon } from './font-awesome'
import './style.less'
import { ThemeManager } from './theme'
import { PcHeader } from './header/pc'
import { MobileHeader } from './header/mobile'
import { registerSearchShortcut } from './search-modal'

export interface PageInfo {
  name: string
  path: string
  title: string
  lang: string
  order?: number
  description?: string
  icon?: string
  /** 所属分类，用于侧边栏分组 */
  category?: string
}

interface DocsLayoutOpts {
  /** 当前语言 */
  lang: string
  /** 当前激活的页面名称 */
  activePage: string
  /** 全部语言的所有页面 */
  pages: PageInfo[]
}

/**
 * 文档布局：Header（PC 端与移动端两个独立头部，按端侧显示）+ 侧边栏菜单 + 内容区。
 * PC 端菜单常驻左侧，移动端抽屉式收起。
 */
export abstract class DocsLayout extends ResponsiveModule {
  private opts: DocsLayoutOpts
  private themeManager: ThemeManager

  constructor(opts: DocsLayoutOpts) {
    super('docs-layout')
    this.opts = opts
    this.themeManager = new ThemeManager()
    // 全局快捷键 Cmd/Ctrl+K 打开搜索
    registerSearchShortcut(() => this.opts.lang)
    this.render()
  }

  // ===== 侧边栏滚动位置管理 =====

  /** 初始化菜单的滚动恢复和保存逻辑 */
  private initMenuScroll(menuEl: HTMLElement): void {
    // 滚动时保存
    menuEl.addEventListener(
      'scroll',
      () => {
        sessionStorage.setItem('docs-menu-scroll-top', String(menuEl.scrollTop))
      },
      { passive: true }
    )
    // 等 DOM 渲染完成后恢复
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const saved = sessionStorage.getItem('docs-menu-scroll-top')
        if (saved) {
          menuEl.scrollTop = parseInt(saved, 10)
        }
      })
    })
  }

  buildContent(_sizeInfo: { respSize: ResponsiveSize; windowWidth: number }): void {
    const { lang, activePage, pages } = this.opts

    // 仅当前语言的页面，用于 sidebar
    const currentLangPages = pages
      .filter(p => p.lang === lang)
      .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))

    // ---- Header（PC 端与移动端两个独立组件，由 CSS 控制显示） ----
    this.addChild({
      tag: 'header',
      classNames: 'docs-header',
      children: [
        new PcHeader({
          lang,
          themeManager: this.themeManager,
          switchLang: targetLang => this.switchLang(targetLang)
        }),
        new MobileHeader({
          lang,
          themeManager: this.themeManager,
          switchLang: targetLang => this.switchLang(targetLang),
          toggleMenu: () => this.toggleMenu()
        })
      ]
    })

    // ---- Body（sidebar + 内容区，并排） ----
    this.addChild({
      tag: 'div',
      classNames: 'docs-body',
      children: [
        // 移动端遮罩
        {
          tag: 'div',
          classNames: 'docs-menu-overlay',
          onClick: () => this.closeMenu()
        },
        // 侧边菜单（按 category 分组）
        {
          tag: 'nav',
          classNames: 'docs-menu',
          postHandle: el => this.initMenuScroll(el),
          children: this.buildMenuItems(currentLangPages, activePage)
        },
        // 内容区
        {
          tag: 'div',
          classNames: 'docs-content',
          children: this.buildMainContent()
        }
      ]
    })
  }

  // ===== 公共能力（供 PcHeader / MobileHeader 复用） =====

  /**
   * 切换语言：跳转到目标语言的同名页面，若不存在则跳转到首页。
   * 使用 BASE_URL 拼接，兼容部署到子路径（如 GitHub Pages /wok-ui-ext/）。
   */
  private switchLang(targetLang: string): void {
    const samePage = this.opts.pages.find(
      p => p.lang === targetLang && p.name === this.opts.activePage
    )
    if (samePage) {
      location.href = import.meta.env.BASE_URL + samePage.path
    } else {
      location.href = import.meta.env.BASE_URL + `${targetLang}/index.html`
    }
  }

  private toggleMenu(): void {
    this.el.classList.toggle('menu-open')
  }

  private closeMenu(): void {
    this.el.classList.remove('menu-open')
  }

  /**
   * 构建侧边栏菜单项，支持按 category 分组。
   */
  private buildMenuItems(pages: PageInfo[], activePage: string): SubModulesOpt {
    // 按 category 分组
    const categorized = new Map<string, PageInfo[]>()
    const uncategorized: PageInfo[] = []
    for (const p of pages) {
      if (p.category) {
        const list = categorized.get(p.category)
        if (list) list.push(p)
        else categorized.set(p.category, [p])
      } else {
        uncategorized.push(p)
      }
    }

    // 分类排序：以该类首个页面的 order 为准
    const sortedCats = [...categorized.entries()].sort(
      (a, b) => (a[1][0]?.order ?? Infinity) - (b[1][0]?.order ?? Infinity)
    )

    const result: SubModulesOpt[] = []

    // 无分类项
    for (const p of uncategorized) {
      result.push(this.createMenuItem(p, activePage))
    }

    // 分类组
    for (const [catName, catPages] of sortedCats) {
      result.push({
        tag: 'div',
        classNames: 'docs-menu-category',
        innerText: catName
      })
      for (const p of catPages) {
        result.push(this.createMenuItem(p, activePage, true))
      }
    }

    return result as SubModulesOpt
  }

  /**
   * 创建单个菜单项。
   * @param sub 是否为分类下的子项
   */
  private createMenuItem(p: PageInfo, activePage: string, sub?: boolean): SubModulesOpt {
    const classes = ['docs-menu-item']
    if (sub) classes.push('docs-menu-item-sub')
    if (p.name === activePage) classes.push('active')
    return {
      tag: 'a',
      classNames: classes,
      // BASE_URL 兼容子路径部署（如 GitHub Pages /wok-ui-ext/）
      attrs: { href: import.meta.env.BASE_URL + p.path },
      children: p.icon
        ? [
            new FontAwesomeIcon({ iconClass: p.icon as FontAwesomeIconClass }),
            { tag: 'span', innerText: p.title }
          ]
        : { tag: 'span', innerText: p.title },
      onClick: () => this.closeMenu()
    }
  }

  protected abstract buildMainContent(): SubModulesOpt
}
