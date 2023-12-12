# 表格

表格是网页上常用的数据展示组件，组件库也提示了一个简单的表格模块 Table，满足基本需求。

## 基本使用

表格需要与数组绑定，然后针对数据的元素做处理。

数据准备，示例里是演示数据，实现开发中数据可能来自于服务器。

```ts
interface User {
  id: string
  name: string
  age: number
  city: string
  gender: string
  dept: string
  status: string
}

const list: User[] = [
  {
    id: '001',
    name: '张三',
    age: 25,
    city: '北京',
    gender: '男',
    dept: '研发部',
    status: '激活'
  }
  // 更多的元素省略...
]
```

下面使用 list 来构建一个表格。

```ts
/**
 * 申明一个已选id列表，来存放被勾选的用户 id
 */
let checkedIds: string[] = []

// Table　是有泛型的，需要写明
// 否则可能无法在列设置中自动推断
new Table<User>({
  // 是否带边框的样式风格
  bordered: true,
  // list 数据列表，User[] 类型，与泛型对应
  list,
  cols: [
    // 构建一个展示序号的列
    new TableIndexColumn(),
    // 构造一个勾选框的列
    new TableCheckboxColumn({
      // 勾选框的值是用户id
      value: user => user.id,
      // 是否已选的初始状态
      checked: user => checkedIds.includes(user.id),
      // 回调处理，保存勾选的id列表
      onChange(checkedVals) {
        checkedIds = checkedVals
      }
    }),
    // 普通列，表头是姓名，内容是用户姓名
    new TableColumn({ name: '姓名', width: 100, content: user => user.name }),
    // 内容可以是任意模块
    new TableColumn({
      name: '状态',
      content: user => {
        if (user.status === '激活') {
          return new PrimaryBodyText('激活').setColor(getColor().success)
        } else {
          return new PrimaryBodyText('冻结').setColor(getColor().danger)
        }
      }
    })
  ]
})
```

目前表格组件仅能用于简单的数据展示，不支持表头和列固定，或是单元格合并等功能。
