import type { ContextMenuItem } from 'wok-ui-ext'

/** 支持的语言列表 */
export const SUPPORTED_LANGS: { code: string; label: string }[] = [
  { code: 'zh-CN', label: '中' },
  { code: 'en', label: 'EN' }
]

export interface LangMenuOpts {
  /** 当前语言 */
  lang: string
  /** 切换语言回调 */
  switchLang: (targetLang: string) => void
}

/** 构建语言选择菜单项，供 PC/移动端头部菜单复用 */
export function buildLangMenuItems(opts: LangMenuOpts): ContextMenuItem[] {
  return SUPPORTED_LANGS.map(l => ({
    label: l.label === '中' ? '中文' : 'English',
    active: l.code === opts.lang,
    callback: () => {
      if (l.code === opts.lang) return
      opts.switchLang(l.code)
    }
  }))
}
