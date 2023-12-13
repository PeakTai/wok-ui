import { DivModule } from '../module';
import { TableColumn } from './column';
export interface TableOptions<T> {
    /**
     * 显示边框.
     */
    bordered?: boolean;
    /**
     * 数据列表.
     */
    list: T[];
    /**
     * 列设置.
     */
    cols: TableColumn<T>[];
}
/**
 * 表格.
 */
export declare class Table<T> extends DivModule {
    constructor(opts: TableOptions<T>);
}
