import { Module } from '../module'
import { TableColumn } from './column'

/**
 * 行.
 */
export class TableRow<T> extends Module {
  constructor(opts: { data: T; cols: TableColumn<T>[]; rowIdx: number }) {
    super(document.createElement('tr'))
    opts.cols.forEach(col => {
      this.addChild(
        new Cell<T>({
          data: opts.data,
          col,
          rowIdx: opts.rowIdx
        })
      )
    })
  }
}

class Cell<T> extends Module {
  constructor(opts: { data: T; col: TableColumn<T>; rowIdx: number }) {
    super(document.createElement('td'))
    const content = opts.col.setting.content(opts.data, opts.rowIdx)
    this.addChild(content)
  }
}
