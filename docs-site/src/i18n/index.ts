import { getI18n, I18n } from 'wok-ui'
import enUS from './en-US'
import zhCN from './zh-CN'
import type { DocsI18nMessages } from './messages'

let docsI18n: I18n<DocsI18nMessages> | undefined

export type { DocsI18nMessages }

/**
 * 获取 docs 站点的 i18n 实例。
 * 基于 wok-ui 的全局 i18n 扩展，与框架的语言同步切换。
 */
export function getDocsI18n(): I18n<DocsI18nMessages> {
  if (docsI18n) {
    return docsI18n
  }
  const i18n = getI18n()
  docsI18n = i18n.extend<DocsI18nMessages>(enUS)
  docsI18n.setMsgs('zh-CN', zhCN)
  return docsI18n
}
