/**
 * 模块基类. 一个模块是对一到多个 dom 元素的封装，其作用是快速复用常用的 dom 组合。
 */
export declare abstract class Module {
    protected readonly el: HTMLElement;
    private __children;
    private __parent?;
    /**
     * 销毁标识
     */
    private __destroyed;
    /**
     * 构建模块.
     * @param el 根元素.
     */
    constructor(el: HTMLElement);
    protected replaceChild(index: number, newChild: Module): boolean;
    protected insertChild(index: number, newChild: ConvertibleModule): boolean;
    /**
     * 移动子模块的位置
     * @param sourceIndex 要移动的子模块下标
     * @param targetIndex 移动后的子模块下标
     */
    protected moveChild(sourceIndex: number, targetIndex: number): boolean;
    destroy(): void;
    protected empty(): void;
    getParent(): Module | undefined;
    /**
     * 用于别的模块替换当前模块.
     * @param module
     */
    replaceBy(module: Module): boolean;
    protected find<T>(predicate: (m: Module) => boolean): T[];
    protected findFirst<T>(predicate: (m: Module) => boolean): T | undefined;
    protected addChild(...child: ConvertibleModule[]): void;
    private __addSingleChild;
    protected removeChild(moduleOrIndex: Module | number): boolean;
    protected getChildren(): Readonly<Module[]>;
    protected getChild(index: number): Module | undefined;
    /**
     * 挂载到 dom 元素上
     * @param parentEl
     */
    mount(parentEl: Element): void;
    /**
     * 滚动使元素可见.
     */
    scrollIntoView(): void;
    /**
     * 获取在兄弟元素中的下标.
     * @returns
     */
    getIndex(): number;
    /**
     * 如果不可见，滚动至可见.
     */
    scrollIntoViewIfInvisible(): void;
}
/**
 * 基础的 div 模块
 */
export declare class DivModule extends Module {
    constructor(...classNames: string[]);
}
/**
 * 可转换为模块的类型，这些类型在一些场景可以直接当模块来使用，主要是为了方便.
 */
export type ConvertibleModule = string | number | Module | HTMLElement | (() => Module) | CreateDomModuleOptions;
/**
 * 将受支持的类型实例转换成模块实例
 * @param cm
 */
export declare function convertToModule(cm: ConvertibleModule): Module;
/**
 * 子模块选项，可用于模块的构建参数中.
 * 支持直接使用可转换的模块和动态添加的函数.
 */
export type SubModulesOpt = ConvertibleModule | ConvertibleModule[] | ((addChild: (...child: ConvertibleModule[]) => void) => void);
/**
 * 子模块选项来构建子模块列表
 * @param opt
 */
export declare function buildSubModules(opt: SubModulesOpt): Module[];
export interface CreateDomModuleOptions {
    /**
     * html标签
     */
    tag?: keyof HTMLElementTagNameMap;
    /**
     * 内部文本
     */
    innerText?: string;
    /**
     * 内部 html，innerText 优先级更高
     */
    innerHTML?: string;
    /**
     * 属性
     */
    attrs?: Record<string, string>;
    /**
     * css 类名称
     */
    classNames?: string[] | string;
    /**
     * 样式设置
     */
    style?: Partial<CSSStyleDeclaration>;
    /**
     * 子模块
     */
    children?: SubModulesOpt;
    /**
     * 前置处理，可以在元素刚创建时做一些额外的操作
     * @param el
     * @returns
     */
    preHandle?: (el: HTMLElement) => void;
    /**
     * 后置处理，可以在元素处理完成后（属性赋值和子模块构造完成）做一些额外的操作
     * @param el
     * @returns
     */
    postHandle?: (el: HTMLElement) => void;
    /**
     * 点击事件，因为点击比较常用，所以有单独的设置项
     */
    onClick?: (ev: MouseEvent) => void;
    /**
     * 事件绑定设置
     */
    events?: Record<string, (e: Event) => void>;
}
/**
 * 快速创建一个基于 dom 元素的模块，用于构建模块内部结构
 * @param options
 * @returns
 */
export declare function createDomModule(options: CreateDomModuleOptions): Module;
