import { DivModule, SubModulesOpt } from '../module';
/**
 * 条目
 */
export interface DropdownMenuItem {
    /**
     * 标题
     */
    label: string;
    /**
     * 是否显示为禁用状态，禁用状态不会触发回调
     */
    disabled?: boolean;
    /**
     * 回调处理
     * @returns
     */
    callback?: () => void;
}
export interface DropdownOpts {
    /**
     * 菜单，可以设置条目，也可以通过模块完全自定义内容
     */
    menus: DropdownMenuItem[] | SubModulesOpt;
    /**
     * 内容
     */
    content: SubModulesOpt;
    /**
     * 菜单对齐方式，默认左对齐(left)
     */
    menusAlign?: 'left' | 'right';
}
/**
 * 下拉框
 */
export declare class Dropdown extends DivModule {
    #private;
    constructor(opts: DropdownOpts);
    destroy(): void;
}
/**
 * 上拉框
 */
export declare class Dropup extends Dropdown {
    constructor(opts: DropdownOpts);
}
