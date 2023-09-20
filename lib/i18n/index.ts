// 国际化
import { enUS } from './en-US'
import { ExtensibleI18n, I18n } from './i18n'
import { I18nMessages } from './message'
import { zhCN } from './zh-cn'

let I18N: ExtensibleI18n<I18nMessages> | undefined

export function getI18n(): ExtensibleI18n<I18nMessages> {
  if (I18N) {
    return I18N
  }
  // 如果 i18n 对象不存在，则创建，并进行初始化
  I18N = new ExtensibleI18n(enUS)
  I18N.setMsgs('zh-CN', zhCN)
  const tags = I18N.getSupportedLanguageTags(...navigator.languages)
  if (tags.length) {
    I18N.setLang(tags[0])
  }
  return I18N
}

export * from './i18n'
