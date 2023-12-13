import { DivModule, SubModulesOpt } from '../module';
export interface JustifyBoxOpts {
    /**
     * 子模块
     */
    children: SubModulesOpt;
    /**
     * 内容对齐方式，默认 stretch （拉伸）
     */
    align?: 'center' | 'top' | 'bottom' | 'stretch';
    /**
     * 点击事件绑定
     * @param ev
     * @returns
     */
    onClick?: (ev: MouseEvent) => void;
}
/**
 * 两端对齐盒子，盒子里的内容分页在左右两侧靠边.
 */
export declare class JustifyBox extends DivModule {
    constructor(opts: JustifyBoxOpts);
}
