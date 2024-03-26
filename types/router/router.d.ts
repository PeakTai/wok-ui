import { Module } from '../module';
import { Query } from './query-string';
/**
 * 路由模块.
 * 注：取消了对构造器的支持，因为构造器在运行时很难与函数区分开，程序的处理过于复杂，也不理想.
 */
export type RouterModule = (() => Module) | (() => Promise<Module>);
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
     * 是否缓存
     */
    cache?: boolean;
}
/**
 * 路由，用于模拟页面跳转，而不刷新页面.路由本身也是一个模块，切换页面实际上就是动态的切换路由中的子模块.
 */
export declare abstract class Router extends Module {
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
    constructor(options: {
        rules: RouterRule[];
        cacheLimit?: number;
    });
    handleUrl(): void;
    private handleModule;
    /**
     * 解析当前的地址.
     */
    protected abstract parseCurrentUrl(): {
        path: string;
        query?: Query;
    };
    /**
     * 获取当前路由信息
     * @returns
     */
    getRouterInfo(): {
        path: string;
        query: Query;
    };
    abstract buildUrl(path: string | {
        path: string;
        query: Query;
    }): string;
    abstract push(path: string | {
        path: string;
        query: Query;
    }): void;
    abstract replace(path: string | {
        path: string;
        query: Query;
    }): void;
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
