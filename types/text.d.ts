import { Module } from './module';
/**
 * 文本选项
 */
export interface TextOpts {
    /**
     * 指定标签，默认是 span 标签
     */
    tag?: keyof HTMLElementTagNameMap;
    /**
     * 文字
     */
    text: string;
    /**
     * 颜色
     */
    color?: string;
    /**
     * 尺寸，支持预设和自定义数字（单位px）
     */
    size?: 'sm' | 'default' | 'large' | 'xl' | number;
    /**
     * 是否加粗
     */
    bold?: boolean;
    /**
     * 点击事件
     * @param ev
     * @returns
     */
    onClick?: (ev: MouseEvent) => void;
}
/**
 * 文本.
 */
export declare class Text extends Module {
    constructor(opts: string | TextOpts);
    setText(text: string): this;
    setColor(color: string): this;
    setSize(size: TextOpts['size']): this;
    setBold(bold: boolean): this;
    onClick(listener: (ev: MouseEvent) => void): this;
}
/**
 * 首要正文
 */
export declare class PrimaryBodyText extends Text {
    constructor(text: string);
}
/**
 * 次要正文
 */
export declare class SecondaryBodyText extends Text {
    constructor(text: string);
}
/**
 * 小号次要正文
 */
export declare class SmallSecondaryBodyText extends Text {
    constructor(text: string);
}
/**
 * 普通标题，对应 h2 标签
 */
export declare class Title extends Text {
    constructor(text: string);
}
/**
 * 大号标题，对应 h1 标签，建议一个页面最多出现一个，作为页面的标题
 */
export declare class LargeTitle extends Text {
    constructor(text: string);
}
