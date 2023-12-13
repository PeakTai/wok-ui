/**
 * 国际化，提供不同语言消息构建的功能，默认英文.
 */
export declare class I18n<T extends object> {
    #private;
    readonly enMsgs: T;
    /**
     * 构造 i18n 对象，必须指定英文的消息模板作为默认。
     * @param enMsgs 英文的消息模板
     */
    constructor(enMsgs: T);
    protected findMsgsByLang(langTag: string): Promise<T | undefined>;
    /**
     * 设置一种语言对应的消息模板，支持异步，可以做动态加载
     * @param langTag
     * @param msgs
     */
    setMsgs(langTag: string, msgs: T | (() => Promise<T>)): void;
    /**
     * 给定一个语言标签列表，获得可以被支持的标签列表
     * @param tags
     */
    getSupportedLanguageTags(...tags: string[]): string[];
    /**
     * 设置当前语言，如果指定的语言不被支持，则修改无效
     * @param lang 语言本标签，如 en-US
     * @returns 是否成功，如果语言不支持则返回 false，不会改变现有语言
     */
    setLang(lang: string): Promise<boolean>;
    /**
     * 获取当前语言
     */
    getLang(): string;
    /**
     * 构建国际化消息.
     * @param key 消息模板的 key
     * @param args 参数，如果 key 对应的消息模板有占位符号（{}）可以使用参数来填充
     */
    buildMsg(key: keyof T, ...args: string[]): string;
}
/**
 * 可扩展的 i18n ，增加扩展新 i18n 对象的功能，记录扩展的新对象，同步 setLang 操作
 */
export declare class ExtensibleI18n<T extends object> extends I18n<T> {
    #private;
    setLang(lang: string): Promise<boolean>;
    /**
     * 扩展国际化内容，生成一个新的 i18n 对象，与当前的 i18n 对象语言保持一致，可在新对象中设置扩展部分的语言。
     * <K> 新的消息模板类型
     * @param enMsgs
     */
    extend<K extends object>(enMsgs: K): I18n<K>;
}
