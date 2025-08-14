import { DivModule } from '../module';
/**
 * svg 图标
 */
export declare class SvgIcon extends DivModule {
    /**
     * svg 图标
     * @param options svg 图标 html 字符串 或者 配置对象
     * @param options.svgHtml svg 图标 html 字符串
     * @param options.onClick 点击事件
     * @param options.size 图标大小
     * @param options.color 图标颜色
     */
    constructor(options: string | {
        svgHtml: string;
        onClick?: (e: MouseEvent) => void;
        size?: number;
        color?: string;
    });
    /**
     * 强制改变大小，默认是和文字一样大的
     * @param height
     * @returns
     */
    setSize(height: number): this;
    /**
     * 改变颜色
     * @param color
     * @returns
     */
    setColor(color: string): this;
    onClick(callback: (e: MouseEvent) => void): this;
}
