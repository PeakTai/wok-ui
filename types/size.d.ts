/**
 * 尺寸.
 */
export interface Size {
    /**
     * 文字默认大小
     */
    text: number;
    /**
     * 小号文字
     */
    textSm: number;
    /**
     * 大号文字
     */
    textLg: number;
    /**
     * 文字特大号
     */
    textXl: number;
    /**
     * 圆角半径
     */
    borderRadius: number;
}
/**
 * 获取尺寸信息
 * @returns
 */
export declare function getSize(): Size;
/**
 * 自定义尺寸信息
 * @param size
 */
export declare function setSize(size: Partial<Size>): void;
export declare function resetSize(): void;
/**
 * 将以 rem 单位的值转换为 px
 * @param rem
 */
export declare function rem(rem: number): number;
