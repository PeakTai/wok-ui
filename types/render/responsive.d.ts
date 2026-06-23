import { Module } from '../module';
/**
 * 响应式尺寸,分隔点信息:
 * xs : <576px
 * sm : ≥576px
 * md : ≥768px
 * lg : ≥992px
 * xl : ≥1200px
 * xxl : ≥1400px
 */
export type ResponsiveSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
/**
 * 响应式分隔点.
 */
export declare enum ResponsiveBreakPoint {
    /**
     * Small
     */
    sm = 576,
    /**
     * Medium
     */
    md = 768,
    /**
     * Large
     */
    lg = 992,
    /**
     * Extra large
     */
    xl = 1200,
    /**
     * Extra extra large
     */
    xxl = 1400
}
/**
 * 响应式模块, 根据窗口的缩放来判定是否要重新渲染.
 * 当缩放达到分隔点临界值, ResposiveSize 发生变化时, 会调用 buildContent 重新进行渲染.
 */
export declare abstract class ResponsiveModule extends Module {
    /**
     * 页面大小调整的监听器.
     */
    private readonly __resizeListener;
    private __respSize;
    private __rendering;
    /**
     * 缓存的模块
     */
    private __cache;
    private __saveScrollPositions;
    private __restoreScrollPositions;
    /**
     * 构造器.
     * @param el
     */
    constructor(elOrClassName?: HTMLElement | string);
    /**
     * 根据尺寸信息构建内容
     */
    abstract buildContent(sizeInfo: {
        /**
         * 响应式尺寸.
         */
        respSize: ResponsiveSize;
        /**
         * 视图宽度.
         */
        windowWidth: number;
    }): void;
    /**
     * 渲染，同步执行，清空内容后重新构建。
     * 如果当前正在渲染中，调用会被忽略以避免重入。
     *
     * @param force 是否强制渲染，如果为 false 则在尺寸信息不变化的情况下不渲染
     */
    protected render(force?: boolean): void;
    private __render;
    /**
     * 缓存一个模块，返回的是一个特殊的模块，能够复用，避免重新渲染.
     * 被缓存的模块将会和全量渲染模块销毁的时候一起被销毁，也可以通过 removeCache 方法主要将其销毁.
     * @param opts
     */
    protected cacheModule(opts: {
        /**
         * 模块的唯一标识，用于缓存查找
         */
        key: string;
        /**
         * 要缓存的模块，一个函数，仅首次执行，如果查询到缓存结果，则不执行
         * @returns
         */
        module: () => Module;
    }): Module;
    /**
     * 删除缓存
     * @param key
     */
    protected removeCache(key: string): void;
    /**
     * 清理掉所有的缓存
     */
    protected clearCaches(): void;
    destroy(): void;
}
