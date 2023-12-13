import { Router, RouterRule } from './router';
/**
 * 初始化路由
 */
export declare function initRouter(opts: {
    /**
     * 模式
     */
    mode: 'hash' | 'history';
    /**
     * 基础路径，history 模式有效
     */
    base?: string;
    /**
     * 路由规则
     */
    rules: RouterRule[];
    /**
     * 最大缓存路由页面的数量
     */
    cacheLimit?: number;
}): Router;
/**
 * 获取路由
 */
export declare function getRouter(): Router;
export * from './router';
export * from './router-link';
