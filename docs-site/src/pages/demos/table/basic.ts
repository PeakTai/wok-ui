import {
  FullRenderingModule,
  HBox,
  Link,
  PrimaryBodyText,
  Spacer,
  Table,
  TableCheckboxColumn,
  TableColumn,
  TableIndexColumn,
  getColor,
  rem
} from 'wok-ui'

interface User {
  id: string
  name: string
  age: number
  city: string
  dept: string
  status: string
}

/**
 * 完整表格：序号列、勾选列、数据列、状态列与操作列
 */
export default class TableBasicDemo extends FullRenderingModule {
  private list: User[] = [
    { id: '001', name: 'Alice', age: 25, city: 'Beijing', dept: 'R&D', status: 'Active' },
    { id: '002', name: 'Bob', age: 28, city: 'Shanghai', dept: 'R&D', status: 'Active' },
    { id: '003', name: 'Carol', age: 32, city: 'Guangzhou', dept: 'Sales', status: 'Frozen' },
    { id: '004', name: 'David', age: 33, city: 'Shenzhen', dept: 'Marketing', status: 'Active' },
    { id: '005', name: 'Emma', age: 26, city: 'Hangzhou', dept: 'Sales', status: 'Frozen' }
  ]

  private checkedIds: string[] = []

  constructor() {
    super()
    this.render()
  }

  protected buildContent(): void {
    this.addChild(
      this.cacheModule({
        key: 'table',
        module: () =>
          new Table<User>({
            list: this.list,
            cols: [
              // 序号列
              new TableIndexColumn(),
              // 勾选框列，选中状态由外部维护
              new TableCheckboxColumn({
                value: user => user.id,
                checked: user => this.checkedIds.includes(user.id),
                onChange: vals => {
                  this.checkedIds = vals
                  this.render()
                }
              }),
              new TableColumn({ name: 'Name', width: 100, content: user => user.name }),
              new TableColumn({ name: 'Age', content: user => `${user.age}` }),
              new TableColumn({ name: 'City', width: 100, content: user => user.city }),
              new TableColumn({ name: 'Department', width: 100, content: user => user.dept }),
              // 彩色状态列
              new TableColumn({
                name: 'Status',
                width: 80,
                content: user => {
                  if (user.status === 'Active') {
                    return new PrimaryBodyText('Active').setColor(getColor().success)
                  } else {
                    return new PrimaryBodyText('Frozen').setColor(getColor().danger)
                  }
                }
              }),
              // 操作列：冻结/激活切换与删除
              new TableColumn({
                name: 'Actions',
                width: 120,
                content: user =>
                  new HBox({
                    gap: rem(0.5),
                    children: [
                      new Link({
                        content: user.status === 'Active' ? 'Freeze' : 'Activate',
                        onClick: () => {
                          user.status = user.status === 'Active' ? 'Frozen' : 'Active'
                          this.removeCache('table')
                          this.render()
                        }
                      }),
                      new Link({
                        content: 'Delete',
                        onClick: () => {
                          if (!confirm('Delete this item?')) {
                            return
                          }
                          const idx = this.list.indexOf(user)
                          this.list.splice(idx, 1)
                          const checkedIdx = this.checkedIds.indexOf(user.id)
                          if (checkedIdx !== -1) {
                            this.checkedIds.splice(checkedIdx, 1)
                          }
                          this.removeCache('table')
                          this.render()
                        }
                      })
                    ]
                  })
              })
            ]
          })
      }),
      new Spacer(10),
      new PrimaryBodyText(
        this.checkedIds.length > 0 ? `Checked: ${JSON.stringify(this.checkedIds)}` : 'Nothing checked'
      )
    )
  }
}
