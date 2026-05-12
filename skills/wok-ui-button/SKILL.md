---
name: wok-ui-button
description: 介绍 wok-ui 按钮模块的使用方法，包含按钮类型、描边样式、尺寸、禁用、块级、图标等全部功能选项。
license: MIT
metadata:
  author: Peak Tai
  email: peaktai@qq.com
---

# 按钮

按钮是页面最常用的点按交互元素。wok-ui 提供了 `Button` 模块，支持丰富的样式风格和功能配置。

> **源码位置**：安装 wok-ui 后，按钮模块的源码和样式位于项目中的 `node_modules/wok-ui/lib/button/` 目录下。
> 主要文件：
> - `index.ts` — Button 类实现及 `ButtonOpts` 接口定义
> - `style.less` — 按钮样式（CSS 变量驱动）
>
> 也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认 Button 的完整导出接口。


## 基础用法

通过 `new Button(opts)` 创建按钮实例，然后挂载到页面中。

```ts
import { Button } from 'wok-ui'

new Button({
  text: '点击我',
  onClick(ev) {
    console.log('按钮被点击了')
  }
}).mount(document.body)
```

## 按钮类型

通过 `type` 选项设置按钮的类型，不同类型的按钮颜色含义不同：

| 类型      | 含义说明                             |
| --------- | ------------------------------------ |
| `primary` | 主要，表示推荐的操作，使用主题色     |
| `default` | 默认，比主要优先级低，普通的操作     |
| `success` | 成功，用于完成或结束操作，使用成功色 |
| `danger`  | 危险，表示操作有风险，不建议的操作   |
| `warning` | 警告，表示操作可能有风险             |

```ts
// 主要按钮
new Button({ text: '主要操作', type: 'primary' })

// 成功按钮
new Button({ text: '完成', type: 'success' })

// 危险按钮
new Button({ text: '删除', type: 'danger' })

// 警告按钮
new Button({ text: '谨慎操作', type: 'warning' })

// 默认按钮
new Button({ text: '普通操作', type: 'default' })
```

## 描边样式

通过 `outline: true` 可以将按钮设置为描边（镂空）样式。描边按钮背景透明，边框和文字使用对应类型颜色。

```ts
// 描边主要按钮
new Button({
  text: '描边按钮',
  type: 'primary',
  outline: true
})
```

> **注意**：`default` 类型不支持描边样式。

## 按钮尺寸

通过 `size` 选项设置按钮尺寸，支持三种大小：

```ts
// 大号按钮
new Button({ text: '大号按钮', size: 'lg' })

// 默认尺寸
new Button({ text: '默认按钮', size: 'default' })

// 小号按钮
new Button({ text: '小号按钮', size: 'sm' })
```

## 自定义宽度

通过 `width` 选项指定按钮的固定宽度（单位：像素）：

```ts
new Button({ text: '固定宽度', width: 200 })
```

## 块级按钮

通过 `block: true` 将按钮设置为块级元素，宽度占满父容器：

```ts
new Button({ text: '块级按钮', type: 'primary', block: true })
```

## 禁用状态

通过 `disabled: true` 将按钮设置为禁用状态，按钮不可点击，透明度降低。

```ts
new Button({
  text: '禁用按钮',
  type: 'primary',
  disabled: true
})
```

也可以在创建实例后，通过 `setDisabled` 方法动态切换禁用状态：

```ts
const btn = new Button({ text: '提交', type: 'primary' })

// 禁用按钮
btn.setDisabled(true)

// 启用按钮
btn.setDisabled(false)
```

## 动态设置点击事件

除了在构造函数中通过 `onClick` 选项绑定点击事件，也可以在创建后通过 `onClick` 方法动态绑定：

```ts
const btn = new Button({ text: '点击我' })
btn.onClick(ev => {
  console.log('动态绑定的点击事件')
})
```

## 图标

通过 `icon` 选项可以为按钮添加图标，支持 `SvgIcon` 和 `RemoteSvgIcon`。

默认图标位置在文字前面，也可以通过 `iconPosition` 设置为 `'end'` 放在文字后面：

```ts
import { Button, SvgIcon } from 'wok-ui'

const icon = new SvgIcon(/* ... */)

// 图标在文字前面（默认）
new Button({
  text: '搜索',
  type: 'primary',
  icon
})

// 图标在文字后面
new Button({
  text: '下一步',
  type: 'primary',
  icon,
  iconPosition: 'end'
})
```

## 表单类型

通过 `formType` 选项可以设置按钮在表单中的行为。当 Button 作为 Form 模块的子孙模块时，可以起到提交或重置表单的作用：

```ts
// 提交按钮
new Button({
  text: '提交',
  type: 'primary',
  formType: 'submit'
})

// 重置按钮
new Button({
  text: '重置',
  type: 'default',
  formType: 'reset'
})
```

目前 `reset` 类型仅对原生表单元素有效。

## 完整选项参考

`ButtonOpts` 接口定义了构建 Button 时可传入的全部选项：

| 选项           | 类型                                                    | 默认值    | 说明                                  |
| -------------- | ------------------------------------------------------- | --------- | ------------------------------------- |
| `text`         | `string`                                                | 必填      | 按钮文字                              |
| `type`         | `'primary' \| 'success' \| 'danger' \| 'warning' \| 'default'` | `'default'` | 按钮类型                              |
| `outline`      | `boolean`                                               | `false`   | 是否显示为描边样式                    |
| `block`        | `boolean`                                               | `false`   | 是否显示为块级元素                    |
| `disabled`     | `boolean`                                               | `false`   | 是否禁用                              |
| `size`         | `'sm' \| 'default' \| 'lg'`                             | `'default'` | 按钮尺寸                              |
| `width`        | `number`                                                | -         | 指定宽度（px）                        |
| `onClick`      | `(ev: MouseEvent) => void`                              | -         | 点击事件回调                          |
| `icon`         | `SvgIcon \| RemoteSvgIcon`                              | -         | 图标                                  |
| `iconPosition` | `'start' \| 'end'`                                      | `'start'` | 图标位置                              |
| `formType`     | `'submit' \| 'reset'`                                   | `'button'` | 表单类型                              |
