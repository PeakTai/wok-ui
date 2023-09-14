import { getColor } from '../color'
import { showWarning } from '../message'
import { Module } from '../module'
import { Text } from '../text'
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
    if (content instanceof Promise) {
      this.el.innerText = '加载中...'
      content
        .then(res => {
          this.el.innerText = ''
          if (typeof res === 'string') {
            this.el.innerText = res
          } else {
            this.addChild(res)
          }
        })
        .catch(e => {
          this.el.innerText = ''
          this.addChild(
            new Text({
              text: '加载失败',
              color: getColor().danger
            })
          )
          showWarning(e)
        })
    } else {
      this.addChild(content)
    }
  }
}
