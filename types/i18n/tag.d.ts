export interface LangTag {
    lang: string;
    region?: string;
}
/**
 * 解析语言标签，语言标签格式非常多，这里仅支持语言加地区的形式，如 zh-CN。
 * 更多信息可以查看 https://www.rfc-editor.org/rfc/bcp/bcp47.txt 。
 * @param tag
 * @returns 语言和地区信息，为了方便匹配，全转小写
 */
export declare function parseLangTag(tag: string): LangTag;
