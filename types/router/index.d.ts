import { AbstractRouterInitOpts, Router } from './router';
/**
 * 路由初始化参数
 */
export type RouiterInitOpts = AbstractRouterInitOpts & {
    /**
     * 模式
     */
    mode: 'hash' | 'history';
    /**
     * 基础路径，history 模式有效
     */
    base?: string;
};
/**
 * 初始化路由
 */
export declare function initRouter(opts: RouiterInitOpts): Router;
/**
 * 获取路由
 */
export declare function getRouter(): Router;
export * from './router';
export * from './router-link';
