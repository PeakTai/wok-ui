---
name: wok-ui-dropdown
description: 介绍 wok-ui 下拉菜单模块的使用方法，包括 Dropdown 下拉框、Dropup 上拉框、菜单配置、自定义菜单内容等功能。
license: MIT
metadata:
  author: Peak Tai
  email: peaktai@qq.com
---

# 下拉菜单

wok-ui 提供了 `Dropdown` 和 `Dropup` 模块，用于创建带有下拉菜单的交互元素。用户可以点击触发区域展开菜单，从选项中选择对应的操作。

> **源码位置**：安装 wok-ui 后，下拉菜单模块的源码位于项目中的 `node_modules/wok-ui/lib/dropdown/` 目录下。
> 主要文件：
> - `index.ts` — `Dropdown` / `Dropup` 类实现及 `DropdownMenuItem`、`DropdownOpts` 接口
> - `style.less` — 下拉菜单样式（含弹出定位、菜单项状态）
>
> 也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。
>
> 如果当前处于 wok-ui 仓库本身，源码可直接在 `lib/dropdown/` 目录下查看。

## 基本使用

`Dropdown` 通过 `content` 设置触发区域，`menus` 设置下拉菜单项：

```ts
import { Dropdown, Button, showSuccess } from 'wok-ui'

new Dropdown({
  content: new Button({ text: '点击弹出下拉框' }),
  menus: [
    {
      label: '菜单一',
      callback() {
        showSuccess('点击了菜单一')
      }
    },
    {
      label: '菜单二',
      callback() {
        showSuccess('点击了菜单二')
      }
    },
    {
      label: '菜单三',
      callback() {
        showSuccess('点击了菜单三')
      }
    }
  ]
})
```

点击触发区域展开菜单，再次点击或点击外部区域关闭菜单。

## DropdownMenuItem 菜单项

每个菜单项是一个 `DropdownMenuItem` 对象：

| 选项       | 类型         | 默认值 | 说明                               |
| ---------- | ------------ | ------ | ---------------------------------- |
| `label`    | `string`     | 必填   | 菜单项文字                         |
| `callback` | `() => void` | -      | 点击回调，点击后菜单自动关闭       |
| `disabled` | `boolean`    | `false`| 是否禁用，禁用项不触发回调         |

### 禁用菜单项

通过 `disabled: true` 禁用某个菜单项，禁用项呈半透明状，不可点击：

```ts
new Dropdown({
  content: new Button({ text: '操作' }),
  menus: [
    { label: '编辑', callback: () => edit() },
    { label: '复制', disabled: true, callback: () => copy() },
    { label: '删除', callback: () => remove() }
  ]
})
```

## 菜单对齐

通过 `menusAlign` 控制菜单相对于触发区域的水平对齐方式：

| 值       | 说明             |
| -------- | ---------------- |
| `'left'` | 左对齐（默认）   |
| `'right'`| 右对齐           |

```ts
new Dropdown({
  menusAlign: 'right',
  content: new Button({ text: '弹出的菜单右对齐' }),
  menus: [
    { label: '菜单一' },
    { label: '菜单二' },
    { label: '菜单三' }
  ]
})
```

## 自定义菜单内容

`menus` 除了接收 `DropdownMenuItem[]` 数组，也支持直接传入任意模块，实现完全自定义的菜单区域：

```ts
import { Dropdown, Button, H2, Spacer } from 'wok-ui'

new Dropdown({
  content: new Button({ text: '嵌入自定义内容' }),
  menus: {
    style: { padding: `${rem(1)}px`, width: '250px' },
    children: [
      new H2('自定义菜单头部'),
      new Spacer(),
      '可以嵌入任意模块内容，不局限于简单菜单项。',
      new Spacer(),
      new Button({ text: '确认', type: 'primary', size: 'sm' })
    ]
  }
})
```

> 自定义菜单内容中的点击事件不会自动关闭下拉框。如需关闭，可通过外层 `onClick` 阻止冒泡并在回调中处理。

## Dropup 上拉框

`Dropup` 是 `Dropdown` 的子类，参数完全相同，
只是菜单从触发区域上方弹出，适用于页面底部的操作场景。
