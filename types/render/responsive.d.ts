import { ConvertibleModule, Module } from '../module';
import { CachedModule } from './cached-module';
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
    #private;
    /**
     * 构造器.
     * @param el
     */
    constructor(el?: HTMLElement);
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
     * 请求立即进行渲染.渲染会异步执行，一次程序流程中有多次调用 render() 方法的，会合并成为一次，减少消耗.
     * @param force 是否强制渲染,如果为 false ,则在尺寸信息不变化的情况下不会渲染
     */
    protected render(force?: boolean): void;
    /**
     * 缓存一个模块，返回的是一个特殊的模块，能够复用，避免重新渲染.
     * 被缓存的模块将会和响应式模块销毁的时候一起被销毁，也可以通过 removeCache 主要将其销毁.
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
        module: () => Exclude<ConvertibleModule, () => Module>;
    }): CachedModule;
    /**
     * 删除缓存模块
     * @param key
     */
    protected removeCache(key: string): void;
    /**
     * 清理掉所有的缓存
     */
    protected clearCaches(): void;
    destroyed(): void;
}
