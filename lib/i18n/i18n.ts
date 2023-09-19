import { parseLangTag } from './tag'

/**
 * 国际化对象
 * <T> 消息模板表的类型，消息模板表是一个 key 和 value 都是 string 类型的对象.
 */
export class I18n<T> {
  /**
   * 消息表，key 是语言，value 是一个 key 为地区，value 为 消息模板的 map，两层 map 为的是能够快速匹配.
   * 地区为空的情况下，缺省值为 - 。
   */
  private msgsMap: Map<string, Map<string, T>>
  /**
   * 当前语言
   */
  private lang: string
  /**
   * 消息模板表，与当前语言是对应的
   */
  private msgs: T
  /**
   * 构造 i18n 对象，必须指定一套默认的语言标签和对应的消息模板
   * @param defaultLang
   * @param defaultMsgs
   */
  constructor(private readonly defaultLang: string, private readonly defaultMsgs: T) {
    Object.freeze(defaultMsgs)
    const tag = parseLangTag(defaultLang)
    const regionMap = new Map<string, T>()
    regionMap.set((tag.region || '-').toLowerCase(), defaultMsgs)
    this.msgsMap = new Map<string, Map<string, T>>()
    this.lang = defaultLang
    this.msgs = Object.assign({}, defaultMsgs)
    this.msgsMap.set(tag.lang.toLowerCase(), regionMap)
  }
  /**
   * 设置当前语言，如果指定的语言不被支持，则修改无效
   * @param lang 语言本标签，如 en-US
   * @returns 是否成功，如果语言不支持则返回 false，不会改变现有语言
   */
  setLang(lang: string): boolean {
    const msgs = this.findMsgsByLang(lang)
    if (!msgs) {
      return false
    }
    this.lang = lang
    this.msgs = msgs
    return true
  }

  private findMsgsByLang(lang: string): T | undefined {
    // 检查表中是否支持指定语言，如果不支持则使用默认语言
    const tag = parseLangTag(lang)
    const regionMap = this.msgsMap.get(tag.lang.toLowerCase())
    if (!regionMap) {
      return undefined
    }
    // 查找顺序：
    // 1. 如果有地区信息，查找地区标签对应的消息
    // 2. 上一步没有找到，则查找默认地区标签对应的消息
    // 3. 前面都没有找到，则取语言下的第一个地区的消息
    let msgs: T | undefined = undefined
    if (tag.region) {
      msgs = regionMap.get(tag.region.toLowerCase())
    }
    if (!msgs) {
      msgs = regionMap.get('-')
    }
    if (!msgs) {
      msgs = regionMap.values().next().value
    }
    if (!msgs) {
      return undefined
    }
    return msgs
  }
  /**
   * 使用默认语言.
   */
  useDefault() {
    this.lang = this.defaultLang
    this.msgs = this.defaultMsgs
  }
  /**
   * 获取当前语言
   */
  getLang(): string {
    return this.lang
  }
  /**
   * 获取默认语言
   * @returns
   */
  getDefaultLang() {
    return this.defaultLang
  }
  /**
   * 设定一种语言的消息模板
   * @param lang
   * @param msgs
   */
  setMsgs(lang: string, msgs: T) {
    const tag = parseLangTag(lang)
    let regionMap = this.msgsMap.get(tag.lang)
    if (!regionMap) {
      regionMap = new Map<string, T>()
      this.msgsMap.set(tag.lang.toLowerCase(), regionMap)
    }
    regionMap.set(tag.region || '-', Object.freeze(msgs))
  }

  /**
   * 构建国际化消息.
   * @param key 消息模板的 key
   * @param args 参数，如果 key 对应的消息模板有占位符号（{}）可以使用参数来填充
   */
  buildMsg(key: keyof T, ...args: string[]): string {
    const template = this.msgs[key] as unknown as string
    if (!args || !args.length) {
      return template
    }
    let idx = 0
    return template.replace(/\{\}/g, () => `${args[idx++]}`)
  }
  /**
   * 给定一个语言标签列表，获得可以被支持的标签列表
   * @param tags
   */
  getSupportedLanguageTags(...tags: string[]): string[] {
    return tags.filter(tag => {
      const langTag = parseLangTag(tag)
      return this.msgsMap.get(langTag.lang)
    })
  }
}
