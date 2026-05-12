---
name: wok-ui-table
description: 介绍 wok-ui 表格模块的使用方法，包括基本数据绑定、普通列、序号列、勾选框列以及边框样式等功能。
license: MIT
metadata:
  author: Peak Tai
  email: peaktai@qq.com
---

# 表格

wok-ui 提供了 `Table` 模块用于数据展示，通过泛型绑定数据类型并配置列定义来渲染表格。内置了普通列、序号列和勾选框列三种列类型，满足常见的表格展示与选择需求。

> **源码位置**：安装 wok-ui 后，表格模块的源码位于项目中的 `node_modules/wok-ui/lib/table/` 目录下。
> 主要文件：
> - `table.ts` — `Table` 表格容器及 `TableOptions` 接口
> - `column.ts` — `TableColumn`、`TableCheckboxColumn`、`TableIndexColumn` 列定义
> - `header.ts` — `TableHeader` 表头
> - `body.ts` — `TableBody` 表格主体
> - `row.ts` — `TableRow` 行及 `Cell` 单元格
>
> 也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。
>
> 如果当前处于 wok-ui 仓库本身，源码可直接在 `lib/table/` 目录下查看。

> **注意**：目前表格组件仅用于简单的数据展示，不支持表头和列固定、单元格合并等高级功能。

## 基本使用

`Table` 是泛型类，需要传入数据类型。通过 `list` 绑定数据，`cols` 配置列定义：

```ts
import { Table, TableColumn, TableIndexColumn, TableCheckboxColumn } from 'wok-ui'

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
  { id: '001', name: '张三', age: 25, city: '北京', gender: '男', dept: '研发部', status: '激活' },
  { id: '002', name: '李四', age: 30, city: '上海', gender: '女', dept: '市场部', status: '冻结' }
]

new Table<User>({
  bordered: true,
  list,
  cols: [
    new TableIndexColumn(),
    new TableCheckboxColumn({
      value: user => user.id,
      checked: user => checkedIds.includes(user.id),
      onChange(checkedVals) {
        checkedIds = checkedVals
      }
    }),
    new TableColumn({ name: '姓名', width: 100, content: user => user.name }),
    new TableColumn({ name: '年龄', width: 60, content: user => `${user.age}` }),
    new TableColumn({ name: '城市', content: user => user.city }),
    new TableColumn({ name: '部门', content: user => user.dept }),
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
}).mount(document.body)
```

> `Table` 泛型参数 `<User>` 应与 `list` 的元素类型一致，这样列定义的 `content` 回调中能获得正确的类型推断。

## Table 表格容器

| 选项       | 类型                  | 默认值  | 说明                                         |
| ---------- | --------------------- | ------- | -------------------------------------------- |
| `list`     | `T[]`                 | 必填    | 数据列表，元素类型与泛型 `T` 对应            |
| `cols`     | `TableColumn<T>[]`    | 必填    | 列定义数组，按顺序从左到右排列               |
| `bordered` | `boolean`             | `false` | 是否显示边框样式                             |

## TableColumn 普通列

最基本的列类型，用于展示数据字段：

```ts
import { TableColumn } from 'wok-ui'

new TableColumn<User>({
  name: '姓名',
  width: 100,
  content: user => user.name
})
```

| 选项      | 类型                                                 | 默认值 | 说明                                   |
| --------- | ---------------------------------------------------- | ------ | -------------------------------------- |
| `name`    | `ConvertibleModule`                                  | 必填   | 列名称（表头），可以是字符串或任意模块 |
| `content` | `(data: T, rowIdx: number) => ConvertibleModule`     | 必填   | 单元格内容生成函数，接收行数据和行索引 |
| `width`   | `number`                                             | `80`   | 列宽度（px）                           |

`content` 回调返回的内容可以是任意模块，不限于纯文本：

```ts
new TableColumn({
  name: '操作',
  content: (user, idx) =>
    new Button({
      text: '编辑',
      type: 'primary',
      size: 'sm',
      onClick: () => console.log('编辑第', idx + 1, '行:', user.name)
    })
})
```

## TableIndexColumn 序号列

自动生成从 1 开始递增的行序号，宽度固定为 30px，无需额外配置：

```ts
import { TableIndexColumn } from 'wok-ui'

new TableIndexColumn()
```

## TableCheckboxColumn 勾选框列

提供行选择功能，当 `name` 不传时表头自动显示全选勾选框：

```ts
import { TableCheckboxColumn } from 'wok-ui'

let checkedIds: string[] = []

new TableCheckboxColumn<User>({
  value: user => user.id,
  checked: user => checkedIds.includes(user.id),
  onChange(checkedVals) {
    checkedIds = checkedVals
  }
})
```

| 选项       | 类型                                     | 默认值 | 说明                                                     |
| ---------- | ---------------------------------------- | ------ | -------------------------------------------------------- |
| `value`    | `(data: T, rowIdx: number) => string`    | 必填   | 勾选框绑定的值，通常用唯一标识字段                       |
| `checked`  | `(data: T, rowIdx: number) => boolean`   | -      | 初始勾选状态，返回 `true` 表示已勾选                     |
| `name`     | `string`                                 | -      | 列名称，传入后表头不显示全选勾选框，改为显示该名称       |
| `onChange` | `(checkedVals: string[]) => void`        | -      | 勾选状态变化回调，返回当前所有已勾选的值数组             |

### 方法

`TableCheckboxColumn` 实例提供以下方法：

| 方法                   | 说明                                     |
| ---------------------- | ---------------------------------------- |
| `getCheckedValues()`   | 获取当前所有已勾选的值，返回 `string[]`  |
| `checkAll()`           | 全选所有行                               |
| `uncheckAll()`         | 取消全选                                 |

```ts
const checkCol = new TableCheckboxColumn<User>({ value: user => user.id })

// 全选
checkCol.checkAll()

// 取消全选
checkCol.uncheckAll()

// 获取已选中的值
const selected = checkCol.getCheckedValues()
```

> **注意**：`TableCheckboxColumn` 全选/取消全选会联动触发 `onChange` 回调，在回调中同步 `checkedIds` 即可。

## 边框样式

通过 `bordered: true` 为表格添加外边框和单元格边框：

```ts
new Table<User>({
  bordered: true,   // 带边框的表格样式
  list,
  cols: [/* ... */]
})
```

对比默认无边框样式，`bordered` 会为表格和每个单元格添加边框线，视觉上更分明。

## 完整示例

以下是一个带边框、带勾选和自定义内容列的表格完整示例：

```ts
import { Table, TableColumn, TableIndexColumn, TableCheckboxColumn, Button } from 'wok-ui'

interface User {
  id: string
  name: string
  age: number
  dept: string
  status: string
}

const list: User[] = [
  { id: '001', name: '张三', age: 25, dept: '研发部', status: '激活' },
  { id: '002', name: '李四', age: 30, dept: '市场部', status: '冻结' },
  { id: '003', name: '王五', age: 28, dept: '销售部', status: '激活' }
]

let checkedIds: string[] = []

new Table<User>({
  bordered: true,
  list,
  cols: [
    new TableIndexColumn(),
    new TableCheckboxColumn({
      value: user => user.id,
      checked: user => checkedIds.includes(user.id),
      onChange(vals) {
        checkedIds = vals
        console.log('已选中:', vals)
      }
    }),
    new TableColumn({ name: '姓名', width: 100, content: user => user.name }),
    new TableColumn({ name: '年龄', width: 60, content: user => `${user.age}` }),
    new TableColumn({ name: '部门', content: user => user.dept }),
    new TableColumn({
      name: '状态',
      content: user => user.status
    }),
    new TableColumn({
      name: '操作',
      content: user =>
        new Button({
          text: '编辑',
          type: 'primary',
          size: 'sm',
          onClick: () => console.log('编辑:', user.name)
        })
    })
  ]
}).mount(document.body)
```
