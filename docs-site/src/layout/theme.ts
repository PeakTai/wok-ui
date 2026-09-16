import { RemoteSvgIcon } from 'wok-ui'
import { getDocsI18n } from '../i18n'
import type { DocsI18nMessages } from '../i18n'
import { applyTheme, getAllThemes, showContextMenu, type ContextMenuItem, type ThemeName } from 'wok-ui-ext'

const ALL_THEMES = getAllThemes()
const STORAGE_KEY = 'theme'
// BASE_URL 兼容子路径部署（如 GitHub Pages /wok-ui/）
const ICON_BASE = import.meta.env.BASE_URL + 'vendor/fontawesome-5.15.4/svgs/'
const THEME_ICON_URL: Record<ThemeName, string> = {
  default: ICON_BASE + 'solid/cube.svg',
  dark: ICON_BASE + 'solid/moon.svg',
  orange: ICON_BASE + 'solid/fire.svg',
  purple: ICON_BASE + 'regular/gem.svg',
  green: ICON_BASE + 'solid/tree.svg',
  red: ICON_BASE + 'solid/heart.svg'
}

const THEME_LABEL_KEYS: Record<ThemeName, keyof DocsI18nMessages> = {
  default: 'theme-tech-blue',
  dark: 'theme-night-sky',
  orange: 'theme-orange',
  purple: 'theme-purple',
  green: 'theme-green',
  red: 'theme-red'
}

export class ThemeManager {
  private _theme: ThemeName

  constructor() {
    this._theme = this.load()
  }

  get current(): ThemeName {
    return this._theme
  }

  /** 切换主题 */
  switch(theme: ThemeName): void {
    this._theme = theme
    applyTheme(theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }

  /** 在事件位置弹出主题选择菜单 */
  showThemeMenu(e: MouseEvent): void {
    showContextMenu({
      evt: e,
      position: 'bottom',
      align: 'end',
      menu: this.buildThemeMenuItems()
    })
  }

  /** 构建主题选择菜单项，供 header 更多菜单等场景以子菜单形式复用 */
  buildThemeMenuItems(): ContextMenuItem[] {
    return ALL_THEMES.map(t => ({
      icon: new RemoteSvgIcon({ iconUrl: THEME_ICON_URL[t] }),
      label: getDocsI18n().buildMsg(THEME_LABEL_KEYS[t]),
      active: t === this._theme,
      callback: () => this.switch(t)
    }))
  }

  private load(): ThemeName {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeName | null
    const theme = (ALL_THEMES as ThemeName[]).includes(stored ?? ('' as ThemeName))
      ? stored!
      : 'default'
    applyTheme(theme)
    return theme
  }
}
