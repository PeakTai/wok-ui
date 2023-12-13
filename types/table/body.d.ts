import { Module } from '../module';
import { TableColumn } from './column';
import { Table } from './table';
interface TableBodyOpts<T> {
    table: Table<T>;
    list: T[];
    cols: TableColumn<T>[];
}
/**
 * 表格主体.
 */
export declare class TableBody<T> extends Module {
    constructor(opts: TableBodyOpts<T>);
}
export {};
