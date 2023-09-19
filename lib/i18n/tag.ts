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
