import { Module } from '../module'
import { TableColumn } from './column'
import { TableRow } from './row'
import { Table } from './table'

interface TableBodyOpts<T> {
  table: Table<T>
  list: T[]
  cols: TableColumn<T>[]
}
/**
 * 表格主体.
 */
export class TableBody<T> extends Module {
  constructor(opts: TableBodyOpts<T>) {
    super(document.createElement('tbody'))
    this.addChild(
      ...opts.list.map(
        (data, idx) =>
          new TableRow<T>({
            data,
            cols: opts.cols,
            rowIdx: idx
          })
      )
    )
  }
}
