import { DivModule } from '../module';
/**
 * 远程svg图标，推荐在项目中使用，使用远程的 svg 图片而不集成在项目中，
 * 减少包体积，提升打包速度和程序加载速度
 */
export declare class RemoteSvgIcon extends DivModule {
    constructor(iconUrl: string);
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
