import {
  BoolCheckbox,
  FullRenderingModule,
  Spacer,
  Table,
  TableColumn,
  TableIndexColumn
} from 'wok-ui'

interface User {
  id: string
  name: string
  age: number
  city: string
}

/**
 * 带边框的表格，可开关切换
 */
export default class TableBorderedDemo extends FullRenderingModule {
  private list: User[] = [
    { id: '001', name: 'Alice', age: 25, city: 'Beijing' },
    { id: '002', name: 'Bob', age: 28, city: 'Shanghai' },
    { id: '003', name: 'Carol', age: 32, city: 'Guangzhou' }
  ]

  private bordered = true

  constructor() {
    super()
    this.render()
  }

  protected buildContent(): void {
    this.addChild(
      new BoolCheckbox({
        label: 'Bordered',
        value: this.bordered,
        onChange: value => {
          this.bordered = value
          this.removeCache('table')
          this.render()
        }
      }),
      new Spacer(10),
      this.cacheModule({
        key: 'table',
        module: () =>
          new Table<User>({
            bordered: this.bordered,
            list: this.list,
            cols: [
              new TableIndexColumn(),
              new TableColumn({ name: 'Name', width: 100, content: user => user.name }),
              new TableColumn({ name: 'Age', content: user => `${user.age}` }),
              new TableColumn({ name: 'City', width: 100, content: user => user.city })
            ]
          })
      })
    )
  }
}
