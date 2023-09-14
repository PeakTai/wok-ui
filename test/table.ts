import {
  BoolCheckbox,
  FullRenderingModule,
  HBox,
  LargeTitle,
  Link,
  PrimaryBodyText,
  Spacer,
  Table,
  TableCheckboxColumn,
  TableColumn,
  TableIndexColumn,
  getColor,
  rem
} from '../lib'
import { TestLayout } from './layout/index'

interface User {
  id: string
  name: string
  age: number
  city: string
  gender: string
  dept: string
  status: string
}

class Page extends FullRenderingModule {
  private list: User[] = [
    {
      id: '001',
      name: '张三',
      age: 25,
      city: '北京',
      gender: '男',
      dept: '研发部',
      status: '激活'
    },
    {
      id: '002',
      name: '李四',
      age: 28,
      city: '上海',
      gender: '男',
      dept: '研发部',
      status: '激活'
    },
    {
      id: '003',
      name: '王五',
      age: 32,
      city: '广州',
      gender: '男',
      dept: '销售部',
      status: '冻结'
    },
    {
      id: '004',
      name: '马六',
      age: 33,
      city: '深圳',
      gender: '男',
      dept: '研发部',
      status: '激活'
    }
  ]

  private checkedVals: string[] = []
  private bordered = true
  constructor() {
    super()
    this.render()
  }
  protected buildContent(): void {
    this.addChild(
      new LargeTitle('表格'),
      new Spacer(20),
      new HBox({
        gap: rem(1),
        children: [
          new BoolCheckbox({
            label: '显示边框',
            value: this.bordered,
            onChange: value => {
              this.bordered = value
              this.removeCache('table')
              this.render()
            }
          }),
          new PrimaryBodyText(
            this.checkedVals ? `已选择：${JSON.stringify(this.checkedVals)}` : '未选择任何条目'
          )
        ]
      }),
      new Spacer(10),
      this.cacheModule({
        key: 'table',
        module: () =>
          new Table<User>({
            bordered: this.bordered,
            list: this.list,
            cols: [
              // 勾选框列
              new TableCheckboxColumn({
                value: user => user.id,
                onChange: vals => {
                  this.checkedVals = vals
                  this.render()
                },
                checked: user => this.checkedVals.includes(user.id)
              }),
              new TableIndexColumn(), // 序号列
              new TableColumn({ name: '姓名', content: user => user.name }),
              new TableColumn({ name: '年龄', content: user => `${user.age}` }),
              new TableColumn({ name: '性别', content: user => `${user.gender}`, width: 60 }),
              new TableColumn({ name: '城市', content: user => `${user.city}` }),
              new TableColumn({ name: '部门', content: user => `${user.dept}`, width: 100 }),
              // 延迟加载
              new TableColumn({
                name: '积分',
                content: user =>
                  new Promise<string>((res, rej) => {
                    setTimeout(() => {
                      const points = Math.random() * 1000
                      if (points < 500) {
                        rej(`加载${user.name}的积分失败`)
                        return
                      }
                      res(points.toFixed(1))
                    }, 2000)
                  })
              }),
              // 内容是模块
              new TableColumn({
                name: '状态',
                content: user => {
                  if (user.status === '激活') {
                    return new PrimaryBodyText('激活').setColor(getColor().success)
                  } else {
                    return new PrimaryBodyText('冻结').setColor(getColor().danger)
                  }
                }
              }),
              // 内容是模块，模块有点击事件，用于完成业务功能，数据发生变化就重新渲染表格
              new TableColumn({
                name: '操作',
                content: user =>
                  new HBox({
                    gap: rem(0.5),
                    children: [
                      new Link({
                        content: user.status === '激活' ? '冻结' : '激活',
                        onClick: () => {
                          user.status = user.status === '激活' ? '冻结' : '激活'
                          this.removeCache('table')
                          this.render()
                        }
                      }),
                      new Link({
                        content: '删除',
                        onClick: () => {
                          if (!confirm('确定要删除条目吗')) {
                            return
                          }
                          const idx = this.list.indexOf(user)
                          this.list.splice(idx, 1)
                          // 如果是已经勾选，清理掉
                          const idx2 = this.checkedVals.indexOf(user.id)
                          if (idx2 !== -1) {
                            this.checkedVals.splice(idx2, 1)
                          }
                          // 将表格缓存清除，重新渲染整个页面
                          this.removeCache('table')
                          this.render()
                        }
                      })
                    ]
                  }),
                width: 100
              })
            ]
          })
      })
    )
  }
}

export function tableTest() {
  return new TestLayout(new Page())
}
