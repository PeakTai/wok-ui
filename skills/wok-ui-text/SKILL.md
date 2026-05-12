---
name: wok-ui-text
description: 介绍 wok-ui 文本模块的使用方法，包括预设文本类型、Text 基础文本类。
license: MIT
metadata:
  author: Peak Tai
  email: peaktai@qq.com
---

# 文本

wok-ui 提供了 `Text` 基础文本类和多种预设文本类型，覆盖常见的文本展示需求。

> **源码位置**：安装 wok-ui 后，文本模块的源码位于项目中的 `node_modules/wok-ui/lib/text.ts`。
> 主要文件：
> - `text.ts` — `Text` 基础文本类及 `PrimaryBodyText`/`SecondaryBodyText` 等预设类型
>
> 也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。
>
> 如果当前处于 wok-ui 仓库本身，源码可直接在 `lib/text.ts` 查看。

## 预设文本

预设对象可以直接使用，适用于常见的应用场景：

| 预设类型               | 说明                  |
| ---------------------- | --------------------- |
| `PrimaryBodyText`      | 主要正文，默认字号     |
| `SecondaryBodyText`    | 次要正文，灰色         |
| `SmallSecondaryBodyText` | 小号次要正文         |

```ts
import { PrimaryBodyText, SecondaryBodyText, SmallSecondaryBodyText } from 'wok-ui'

new PrimaryBodyText('正文内容')
new SecondaryBodyText('次要描述信息')
new SmallSecondaryBodyText('更小的次要说明')
```

预设文本都继承自 `Text`，可以使用 `Text` 的链式方法快速修改样式：

```ts
import { PrimaryBodyText, getColor } from 'wok-ui'

new PrimaryBodyText('高亮文本').setColor(getColor().primary)
new PrimaryBodyText('加粗文本').setBold(true)
new PrimaryBodyText('大号正文').setSize('large')
```

> **注意**：`Title` 和 `LargeTitle` 已废弃，请使用 heading 技能中的 H2 和 H1 标题。

## Text 基础文本

如果预设类型不能满足需求，可以使用 `Text` 类进行更灵活的配置：

```ts
import { Text, getColor } from 'wok-ui'

new Text({
  tag: 'span',
  text: '文本内容',
  bold: true,
  color: getColor().primary,
  size: 'large',
  onClick(ev) {
    ev.preventDefault()
    console.log('文本被点击')
  }
})
```

`Text` 构造函数也支持直接传入字符串（默认生成 `span` 标签）：

```ts
new Text('简单文本')
```

### 选项参考

| 选项      | 类型                                            | 默认值   | 说明                                 |
| --------- | ----------------------------------------------- | -------- | ------------------------------------ |
| `text`    | `string`                                        | 必填     | 文本内容                             |
| `tag`     | `keyof HTMLElementTagNameMap`                   | `'span'` | 生成的 HTML 标签                      |
| `size`    | `'sm' \| 'default' \| 'large' \| 'xl' \| number` | -        | 字号，支持预设或自定义像素值          |
| `color`   | `ColorKey`                                      | -        | 文字颜色，使用主题色                  |
| `bold`    | `boolean`                                       | `false`  | 是否加粗                             |
| `onClick` | `(ev: MouseEvent) => void`                      | -        | 点击事件                             |

### 方法

`Text` 实例支持链式调用：

```ts
new Text('文本')
  .setText('新内容')
  .setColor('#1677ff')
  .setSize(20)
  .setBold(true)
  .onClick(() => console.log('clicked'))
```

| 方法              | 说明                     |
| ----------------- | ------------------------ |
| `setText(text)`   | 更新文本内容，链式调用   |
| `setColor(color)` | 设置颜色，链式调用       |
| `setSize(size)`   | 设置字号，链式调用       |
| `setBold(bool)`   | 设置加粗，链式调用       |
| `onClick(fn)`     | 绑定点击事件，链式调用   |

## 使用建议

| 场景               | 推荐方式                        |
| ------------------ | ------------------------------- |
| 正文段落           | `PrimaryBodyText` 预设          |
| 辅助/次要说明      | `SecondaryBodyText` 预设        |
| 自定义文本样式     | `Text` 基础类 + 链式方法        |
| 页面结构标题       | `H1`-`H6` 标题模块，详见 heading 技能 |
