import { Module } from '../module';
import { Query } from './query-string';
/**
 * 路由模块.
 * 注：取消了对构造器的支持，因为构造器在运行时很难与函数区分开，程序的处理过于复杂，也不理想.
 */
export type RouterModule = (() => Module) | (() => Promise<Module>);
/**
 * 目标路由位置
 */
export type RouteDestination = string | {
    path: string;
    query: Query;
};
/**
 * 路由规则.
 */
export interface RouterRule {
    /**
     * 路径.支持路径变量，如 /users/:userId .不支持通配符做较复杂的路径.支持特殊值 * , * 表示作为默认页面.
     */
    path: string;
    /**
     * 别名，用于兼容旧地址，如果路径变了，那么将旧地址写在 alias 中.如果 path 定义了变量，那么别名中的变量必须对应.
     */
    alias?: string[];
    /**
     * 模块.
     */
    module: RouterModule;
    /**
     * 是否缓存，被缓存的页面模块会被包裹在一层 div 中，页面切换时不会真正销毁，而是将包裹层隐藏
     */
    cache?: boolean;
}
/**
 * 页面路由信息
 */
export interface Route {
    path: string;
    query?: Query;
}
/**
 * 路由抽象基类初始化参数
 */
export interface AbstractRouterInitOpts {
    /**
     * 规则，不允许重复
     */
    rules: RouterRule[];
    /**
     * 缓存页面的数量限制
     */
    cacheLimit?: number;
    /**
     * 钩子，部分函数能够影响流程，在路由导航处理失败的情况下，页面地址也不会回退
     */
    hooks?: {
        /**
         * 在路由导航之前执行，来决定是否要进行导航
         * @param to 要导航的目标路由信息
         * @param from 来源路由信息，表示用户是从哪个路由导航来的
         * @returns 布尔值来表示是否继续进行路由导航，或者返回一个模块替代原本的页面模块来进行渲染
         * @throws 发生异常的情况下，路由导航也会被中止
         */
        beforeEach?: (to: Route, from: Route) => Promise<boolean | Module> | boolean | Module;
        /**
         * 在路由导航处理完成后执行，不管处理成功与否，即便在 beforeEach 钩子中返回 false 也会执行 afterEach，
         * 总之每次导航必定会触发一次 afterEach
         * @param to 要导航的目标路由信息
         * @param from 来源路由信息，表示用户是从哪个路由导航来的
         * @param  isSuccess 此次导航是否成功
         * @returns 返回结果不会影响流程
         */
        afterEach?: (to: Route, from: Route, isSuccess: boolean) => void;
        /**
         * 错误处理，可以在发生错误的情况下做一些额外的处理，比如重新导航到某个特定页面。
         * 如果没有指定 errorHandler 则会由路由组件来处理，默认会弹出提示。
         * @param error 错误信息
         * @param to 要导航的目标路由信息
         * @param from 来源路由信息，表示用户是从哪个路由导航来的
         * @returns 返回空或一个模块来进行渲染
         */
        errorHandler?: (error: any, to: Route, from: Route) => void | Promise<Module> | Module;
    };
}
/**
 * 路由，用于模拟页面跳转，而不刷新页面.路由本身也是一个模块，切换页面实际上就是动态的切换路由中的子模块.
 */
export declare abstract class Router extends Module {
    private routerOpts;
    /**
     * 路径规则列表，用于匹配.
     */
    private readonly paths;
    private defaultPathInfo?;
    /**
     * 当前路径.
     */
    private currentPath;
    /**
     * 路径变量.
     */
    private pathVars;
    /**
     * 查询参数.
     */
    private query;
    /**
     * 当前展示的模块
     */
    private currentModule?;
    /**
     * 缓存限制
     */
    private cacheLimit;
    /**
     * 容器滚动监听器
     */
    private scrollListener;
    /**
     * 忽略滚动标记，如果为 true 则不要记录位置信息，在浏览器后退的情况下会有一次将滚动位置重置，
     * 必须要避免这次，否则影响缓存页面的位置恢复
     */
    protected ignoreScroll: boolean;
    constructor(routerOpts: AbstractRouterInitOpts);
    /**
     * 卸载当前模块，准备切换到下个页面的模块
     */
    private unloadCurrentModule;
    handleUrl(): void;
    private asyncHandleUrl;
    /**
     * 解析当前的地址.
     */
    protected abstract parseCurrentUrl(): Route;
    /**
     * 获取当前路由信息
     * @returns
     */
    getRouterInfo(): Route;
    /**
     * 清除当前页面的缓存
     */
    removeCurrentPageCache(): void;
    /**
     * 删除某个路径下的缓存
     * @param path 路径
     */
    removeCacheByPath(path: string): void;
    /**
     * 清除匹配指定规则的页面的缓存
     * @param filter 过滤器，匹配要被清理的页面
     */
    removeCache(filter: (route: Route) => boolean): void;
    abstract buildUrl(location: RouteDestination): string;
    abstract push(location: RouteDestination): void;
    abstract replace(location: RouteDestination): void;
    /**
     * 按名称获取链接上的参数，返回第一个值，如“url?a=1&a=2”，getParam('a') 返回 '1'
     * @param paramName 参数名称
     * @returns
     */
    getParam(paramName: string): string;
    /**
     * 获取链接上的所有指定名称的参数值，如“url?a=1&a=2”，getParamVals('a') 返回 ['1','2']
     * @param paramName
     * @returns
     */
    getParamVals(paramName: string): string[];
    /**
     * 获取路径变量，如路由路径是“/books/:id”，则在相应的页面通过 getPathVar('id') 可以获取到 :id 表示的这一段路径内容
     * @param varName
     * @returns
     */
    getPathVar(varName: string): string;
    destroy(): void;
}
