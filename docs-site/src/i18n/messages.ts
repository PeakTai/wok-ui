/**
 * docs 站点扩展国际化消息定义。
 *
 * 新增 key 时需同时在 en-US.ts 和 zh-CN.ts 中添加对应翻译。
 */
export interface DocsI18nMessages {
  // 主题名称（context menu 展示用）
  'theme-tech-blue': string
  'theme-night-sky': string
  'theme-orange': string
  'theme-purple': string
  'theme-green': string
  'theme-red': string

  // 搜索框占位符
  'docs-search-placeholder': string

  // 搜索弹窗
  'docs-search-modal-title': string
  'docs-search-modal-placeholder': string
  'docs-search-empty': string
  'docs-search-empty-hint': string
  'docs-search-hint': string

  // 主题切换按钮 hover 标题
  'docs-theme-toggle-title': string

  // 主题图标旁文字
  'docs-theme-label': string

  // 语言切换图标旁文字
  'docs-lang-label': string
}
