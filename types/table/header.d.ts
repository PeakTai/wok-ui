import { ConvertibleModule, Module } from '../module';
import { TableColumn } from './column';
/**
 * 表头.
 */
export declare class TableHeader<T> extends Module {
    constructor(opts: {
        cols: TableColumn<T>[];
    });
}
export declare class Title extends Module {
    constructor(content: ConvertibleModule, width: number);
}
