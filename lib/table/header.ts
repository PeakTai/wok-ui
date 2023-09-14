import { ConvertibleModule, Module, createDomModule } from '../module'
import { TableColumn } from './column'

/**
 * 表头.
 */
export class TableHeader<T> extends Module {
  constructor(opts: { cols: TableColumn<T>[] }) {
    super(document.createElement('thead'))
    this.addChild(
      createDomModule({
        tag: 'tr',
        children: opts.cols.map(col => {
          const width = col.setting.width && col.setting.width > 0 ? col.setting.width : 80
          return new Title(col.setting.name, width)
        })
      })
    )
  }
}

export class Title extends Module {
  constructor(content: ConvertibleModule, width: number) {
    super(document.createElement('th'))
    this.el.style.width = `${width}px`
    if (typeof content === 'string') {
      this.el.innerText = content
      return
    }
    this.addChild(content)
  }
}
