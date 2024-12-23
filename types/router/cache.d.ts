import { DivModule, Module } from './../module';
/**
 * 缓存模块，不会真正的销毁，可重复使用.
 */
export declare class CachedModule extends DivModule {
    readonly key: string;
    private scrollPos?;
    private title;
    private canceled?;
    constructor(key: string, module: Module);
    cacheScroll(): void;
    /**
     * 取消缓存，取消后，再当页面被隐藏时模块销毁
     */
    cancel(): void;
    hide(): void;
    show(): void;
}
