// 项目统一的 i18n 管理，对基础库进行扩展，提供统一的处理

import { I18n, getI18n } from '../lib'

/**
 * 扩展的 i18n 消息
 */
interface ExtI18nMsgs {
  color: string
  text: string
  icon: string
  button: string
  message: string
  dropdown: string
  drawer: string
  table: string
  layout: string
  modal: string
  form: string
  fullRendering: string
  responsive: string
  routerTest: string
  page404: string
  currentLanguage: string
  switchToCustomLanguage: string
  internationalization: string
}

/**
 * 扩展 i18n 全局对象
 */
let extI18n: I18n<ExtI18nMsgs> | undefined = undefined

/**
 * 初始化 i18n ，完成所有项目中支持的语言的设置，并且切换到合适的语言.
 * 项目需要在初始化 i18n 完成后，才进行页面的处理，否则页面渲染出来可能不是合适的语言.
 */
export async function initI18n() {
  if (extI18n) {
    throw new Error(`Initialization has finished !`)
  }
  const i18n = getI18n()
  // 基础库添加新的语言，设置为异步加载
  i18n.setMsgs('Tibt', () => fetch('/wok-ui/i18n/tibt.json').then(res => res.json()))

  // 先加载默认语言，实际开发中默认语言也可以直接写代码文件中打包集成，减少一次请求
  // 反正无论如何也要有一个默认语言的数据，多一次请求网络代价还要更大一些
  const enUs = await fetch('/wok-ui/i18n/ext-en-us.json').then(res => res.json())

  // 扩展生成新的 i18n 对象，必须设置英文消息模板
  // i18n 组件统一默认使用英文，这样扩展的 i18n 对象与原 i18n 对象可以保持一致
  extI18n = i18n.extend<ExtI18nMsgs>(enUs)

  // 扩展部分设置异步加载其它语言，在需要时才会去拉取数据
  extI18n.setMsgs('zh-CN', () => fetch('/wok-ui/i18n/ext-zh-cn.json').then(res => res.json()))
  extI18n.setMsgs('tibt', () => fetch('/wok-ui/i18n/ext-tibt.json').then(res => res.json()))

  // 设置完所有语言，切换到合适的语言
  // 这里使用浏览器设置的语言列表，实际项目中也有可能会使用用户在平台中设置的语言
  const supportedLangs = i18n.getSupportedLanguageTags(...navigator.languages)
  if (supportedLangs.length) {
    await i18n.setLang(supportedLangs[0])
  }
}

/**
 * 获取扩展的 i18n 对象
 */
export function getExtI18n(): I18n<ExtI18nMsgs> {
  if (!extI18n) {
    throw new Error(`Please invoke initI18n() first !`)
  }
  return extI18n
}
