import { DivModule } from '../module';
/**
 * 远程svg图标，推荐在项目中使用，使用远程的 svg 图片而不集成在项目中，
 * 减少包体积，提升打包速度和程序加载速度
 */
export declare class RemoteSvgIcon extends DivModule {
    /**
     * 远程 svg 图标
     * @param options 图标 url 或者 配置对象
     * @param options.iconUrl 图标 url
     * @param options.onClick 点击事件
     * @param options.size 图标大小
     * @param options.color 图标颜色
     */
    constructor(options: string | {
        iconUrl: string;
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
