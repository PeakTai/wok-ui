import { DivModule } from '../module'
import { TableBody } from './body'
import { TableColumn } from './column'
import { TableHeader } from './header'

export interface TableOptions<T> {
  /**
   * 显示边框.
   */
  bordered?: boolean
  /**
   * 数据列表.
   */
  list: T[]
  /**
   * 列设置.
   */
  cols: TableColumn<T>[]
}

/**
 * 表格.
 */
export class Table<T> extends DivModule {
  constructor(opts: TableOptions<T>) {
    super('kk-table')
    if (opts.bordered) {
      this.el.classList.add('bordered')
    }
    this.addChild({
      tag: 'table',
      children: [
        // 表头
        new TableHeader({ cols: opts.cols }),
        // 主体
        new TableBody<T>({
          table: this,
          list: opts.list,
          cols: opts.cols
        })
      ]
    })
  }
}
