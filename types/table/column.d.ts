import { ConvertibleModule } from '../module';
/**
 * 列设定.
 */
export interface TableColumnSetting<T> {
    /**
     * 列名称.特殊需要传入模块来处理，比如文字需要变色等.
     */
    name: ConvertibleModule;
    /**
     * 列宽度.
     */
    width?: number;
    /**
     * 内容生成.
     */
    content: (data: T, rowIdx: number) => ConvertibleModule;
}
/**
 * 列.
 */
export declare class TableColumn<T> {
    readonly setting: TableColumnSetting<T>;
    constructor(setting: TableColumnSetting<T>);
}
/**
 * 勾选框列.
 */
export declare class TableCheckboxColumn<T> extends TableColumn<T> {
    private checkAllBox?;
    private boxes;
    constructor(opts: {
        /**
         * 勾选框绑定的值.
         */
        value: (data: T, rowIdx: number) => string;
        /**
         * 初始状态，可选.
         */
        checked?: (data: T, rowIdx: number) => boolean;
        /**
         * 列名称，可选，如果有值，则不会在头部显示全选的勾选框.
         */
        name?: string;
        /**
         * 更改事件.
         */
        onChange?: (checkedVals: string[]) => void;
    });
    /**
     * 更新全选勾选框.
     */
    private updateCheckAllBox;
    getCheckedValues(): string[];
    checkAll(): void;
    uncheckAll(): void;
}
/**
 * 序号列.
 */
export declare class TableIndexColumn<T> extends TableColumn<T> {
    constructor();
}
