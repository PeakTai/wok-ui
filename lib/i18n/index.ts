// 国际化

import { enUS } from './en-US'
import { I18nMessages } from './message'
import { equalLangTag, parseLangTag } from './tags'
import { zhCN } from './zh-cn'

/**
 * 可用的语言，
 */
const LANGS = [...navigator.languages]

/**
 * 消息对象与语言映射表，value 是地区与信息的键值对，地区缺省值为 "-"
 */
const MSG_MAP = new Map<string, Record<string, I18nMessages>>()
MSG_MAP.set('zh', { cn: zhCN })
MSG_MAP.set('en', { en: enUS })

/**
 * 当前语言
 */
let CURRENT_LANG = 'en-US'
/**
 * 当前信息
 */
let CURRENT_MESSAGES = Object.freeze(enUS)

function updateLang() {
  for (const lang of LANGS) {
    const tag = parseLangTag(lang)
    const regions = MSG_MAP.get(tag.lang.toLocaleLowerCase())
    if (!regions) {
      continue
    }
    const regionTag = tag.region || '-'
    let msgs = regions[regionTag]
    if (msgs) {
      CURRENT_LANG = lang
      CURRENT_MESSAGES = Object.freeze(msgs)
      return
    }
    // 找不到，使用第一个
    const keys = Object.keys(regions)
    if (!keys.length) {
      continue
    }
    msgs = regions[keys[0]]
    CURRENT_LANG = lang
    CURRENT_MESSAGES = Object.freeze(msgs)
    return
  }
  // 完全匹配不上，使用默认值
  CURRENT_LANG = 'en-US'
  CURRENT_MESSAGES = Object.freeze(enUS)
}

updateLang()

/**
 * 设置当前语言，不设置的情况下默认使用 navigator.languages 中可用的语言
 * @param lang
 */
export function setLang(lang: string) {
  const tag = parseLangTag(lang)
  // 如果已经存在，则删除
  const idx = LANGS.findIndex(l => equalLangTag(parseLangTag(l), tag))
  if (idx !== -1) {
    LANGS.splice(idx, 1)
  }
  LANGS.unshift(lang)
  updateLang()
}
/**
 * 获取当前语言
 */
export function getLang(): string {
  return CURRENT_LANG
}
/**
 * 设置国际化消息
 * @param lang 语言标签
 * @param messages 消息
 */
export function setI18nMessages(lang: string, messages: I18nMessages) {
  const tag = parseLangTag(lang)
  MSG_MAP.set(lang.toLocaleLowerCase(), { [tag.region || '-']: messages })
  updateLang()
}
/**
 * 构建国际化信息。支持参数填充，参数使用“{}”占位，假设部分 i18n 信息是这样的：“{min:"不得小于{}"}”，
 * key 是 min，值中有占位参数，调用 i18nMsg('min',5)，得到“不得小于5”。
 * @param key 语句的 key
 * @param args 参数，可选，针对需要填充参数的信息有效
 * @returns 根据当前设定的语言构建出来的信息
 */
export function i18nMsg(key: keyof I18nMessages, ...args: string[]) {
  if (!args || !args.length) {
    return CURRENT_MESSAGES[key]
  }
  const msg = CURRENT_MESSAGES[key]
  let idx = 0
  return msg.replace(/\{\}/g, () => `${args[idx++]}`)
}
