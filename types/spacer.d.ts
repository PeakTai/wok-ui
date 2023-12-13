import { DivModule } from './module';
/**
 * 垫片，用于增加垂直方向的间隙
 */
export declare class Spacer extends DivModule {
    /**
     * @param height 高度，可以是具体的数字或预设值。normal 为默认高度 1rem，sm 为较小的高度 0.5rem，
     * lg 为较大的高度 2rem
     */
    constructor(height?: number | 'normal' | 'sm' | 'lg');
}
/**
 * 水平方向的垫片
 */
export declare class HSpacer extends DivModule {
    /**
     *
     * @param width 宽度.可以是具体的数字或预设值。normal 为默认 1rem，sm 为较小的宽度 0.5rem，
     * lg 为较大的宽度 2rem。
     */
    constructor(width?: number | 'normal' | 'sm' | 'lg');
}
