export interface LangTag {
  lang: string
  region?: string
}
/**
 * 解析语言标签，语言标签格式非常多，这里仅支持语言加地区的形式，如 zh-CN。
 * 更多信息可以查看 https://www.rfc-editor.org/rfc/bcp/bcp47.txt 。
 * @param tag
 * @returns 语言和地区信息
 */
export function parseLangTag(tag: string): LangTag {
  const [lang, region] = tag.split('-')
  // 解析失败，使用转义
  if (!lang) {
    return { lang: 'zh', region: 'CN' }
  }
  return { lang, region }
}
/**
 * 比较两个语言标签是否相同
 * @param tag1
 * @param tag2
 * @returns
 */
export function equalLangTag(tag1: LangTag, tag2: LangTag) {
  const lang1 = tag1.lang.toLocaleLowerCase()
  const lang2 = tag2.lang.toLocaleLowerCase()
  const region1 = tag1.region ? tag1.region.toLocaleLowerCase() : undefined
  const region2 = tag2.region ? tag2.region.toLocaleLowerCase() : undefined
  return lang1 === lang2 && region1 === region2
}

export function serializeLangTag(tag:LangTag){
  return ``
}
