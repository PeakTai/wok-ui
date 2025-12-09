/**
 * 色彩
 */
export interface Color {
    /**
     * 主题色
     */
    primary: string;
    /**
     * 危险色
     */
    danger: string;
    /**
     * 成功色
     */
    success: string;
    /**
     * 警告色
     */
    warning: string;
    /**
     * 边框
     */
    border: string;
    /**
     * 默认的文字颜色
     */
    text: string;
    /**
     * 文字的次要颜色，比默认色要淡一些
     */
    textSecondary: string;
    /**
     * 描边颜色，用于元素获取焦点时的展示，一般是比主题色更浅的近似色
     */
    outline: string;
}
/**
 * 获取颜色
 */
export declare function getColor(): Color;
/**
 * 设置颜色
 */
export declare function setColor(color: Partial<Color>): void;
/**
 * 重置颜色为默认
 */
export declare function resetColor(): void;
/**
 * 颜色键类型
 * 预定义颜色键或任意字符串
 */
export type ColorKey = 'primary' | 'success' | 'danger' | 'warning' | (string & {});
/**
 * 获取颜色值
 * 如果配置中存在对应的颜色键，返回配置值，否则返回传入的键名
 * @param key 颜色键类型
 * @returns 颜色值
 */
export declare function resolveColor(key: ColorKey): string;
