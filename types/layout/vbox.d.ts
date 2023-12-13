import { DivModule, SubModulesOpt } from '../module';
export interface VboxOpts {
    /**
     * 间隙
     */
    gap?: number;
    /**
     * 子模块内容，支持动态添加
     */
    children: SubModulesOpt;
    /**
     * 内容对齐方式，默认 stretch（拉伸占满横向空间）
     */
    align?: 'left' | 'center' | 'right' | 'stretch';
    /**
     * 点击事件绑定
     * @param ev
     * @returns
     */
    onClick?: (ev: MouseEvent) => void;
}
/**
 * 垂直盒子，内容将从上往下堆叠.
 */
export declare class VBox extends DivModule {
    constructor(opts: VboxOpts);
}
