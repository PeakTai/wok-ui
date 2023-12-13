import { ConvertibleModule, DivModule } from '../module';
/**
 * 分隔盒子，将内容分隔成左右两部分或上下两部分，其中一部分固定空间，另一部分占满剩余的空间.
 */
export declare class VSplitBox extends DivModule {
    constructor(opts: {
        /**
         * 高度
         */
        height: number;
        /**
         * 上边
         */
        top: ConvertibleModule;
        /**
         * 下边
         */
        bottom: ConvertibleModule;
        /**
         * 要固定的一侧，另一侧占满剩余的空间，固定的一侧模块需要有固定的高度
         */
        fixedSide: 'top' | 'bottom';
        /**
         * 点击事件绑定
         * @param ev
         * @returns
         */
        onClick?: (ev: MouseEvent) => void;
    });
}
/**
 * 横向分隔盒子，其中一侧固定宽度，另一侧占满剩余的横向空间.
 */
export declare class HSplitBox extends DivModule {
    constructor(opts: {
        /**
         * 左侧
         */
        left: ConvertibleModule;
        /**
         * 右侧
         */
        right: ConvertibleModule;
        /**
         * 间隙
         */
        gap?: number;
        /**
         * 内容对齐方式
         */
        align?: 'center' | 'top' | 'bottom' | 'stretch';
        /**
         * 要固定的一侧，另一侧占满剩余的空间，固定的一侧模块需要有固定的宽度
         */
        fixedSide: 'left' | 'right';
        /**
         * 点击事件绑定
         * @param ev
         * @returns
         */
        onClick?: (ev: MouseEvent) => void;
    });
}
