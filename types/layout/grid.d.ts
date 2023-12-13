import { ConvertibleModule, DivModule, SubModulesOpt } from '../module';
export interface GridOpts {
    /**
     * 每行的列数. 取值 1-12 .
     */
    cols: number;
    /**
     * 间隙,可分开设置列之间和行之间的间隙.
     */
    gap?: number | {
        col: number;
        row: number;
    };
    /**
     * 单元格. 会按照设定的 cols 和 gap 进行排列.
     */
    cells: SubModulesOpt;
    /**
     * 格子的最小宽度，用于防止内容变形，设置一个最小可以显示全内容的宽度。
     * 这样在空间不够的情况下，就不会显示成指定的列数了，而是将每个格子显示成最小宽度。
     */
    cellMinWidth?: number;
}
/**
 * 网格.
 */
export declare class Grid extends DivModule {
    #private;
    constructor(opts: GridOpts);
    addCell(module: ConvertibleModule): void;
}
