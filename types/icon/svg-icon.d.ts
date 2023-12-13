import { DivModule } from '../module';
/**
 * svg 图标
 */
export declare class SvgIcon extends DivModule {
    constructor(svgHtml: string);
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
}
