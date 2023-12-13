import { Module } from '../module';
import { TableColumn } from './column';
/**
 * 行.
 */
export declare class TableRow<T> extends Module {
    constructor(opts: {
        data: T;
        cols: TableColumn<T>[];
        rowIdx: number;
    });
}
