---
name: layout
description: 介绍 wok-ui 内置的布局模块，包括 HBox、VBox、JustifyBox、HSplitBox、VSplitBox、Grid 六种布局容器的使用方法。
license: MIT
metadata:
  author: Peak Tai
  email: peaktai@qq.com
---

# 布局

wok-ui 内置了六种布局模块，涵盖常见的布局需求，基于 CSS Flexbox 和 Grid 实现。

> **源码位置**：安装 wok-ui 后，布局模块的源码位于项目中的 `node_modules/wok-ui/lib/layout/` 目录下。
> 主要文件：
> - `hbox.ts` — `HBox` 水平堆叠盒子
> - `vbox.ts` — `VBox` 垂直堆叠盒子
> - `justify-box.ts` — `JustifyBox` 两端对齐盒子
> - `split-box.ts` — `HSplitBox` / `VSplitBox` 分隔盒子
> - `grid.ts` — `Grid` 网格布局
>
> 也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。
>
> 如果当前处于 wok-ui 仓库本身，源码可直接在 `lib/layout/` 目录下查看。

## HBox 水平堆叠盒子

将子模块从左往右水平排列，支持换行和反转。

```ts
import { HBox, Button, rem } from 'wok-ui'

new HBox({
  gap: rem(1),
  align: 'center',
  wrap: true,
  reverse: false,
  children: [
    '批量操作：',
    new Button({ text: '激活' }),
    new Button({ text: '冻结' }),
    new Button({ text: '删除' })
  ]
})
```

| 选项      | 类型                                  | 默认值       | 说明                                     |
| --------- | ------------------------------------- | ------------ | ---------------------------------------- |
| `children`| `SubModulesOpt`                       | 必填         | 子模块内容                               |
| `gap`     | `number \| { row: number; column: number }` | -       | 间隙（px），可分别设水平和垂直间隙       |
| `wrap`    | `boolean`                             | `false`      | 内容超出是否换行                         |
| `reverse` | `boolean`                             | `false`      | 是否反转排列方向（从右往左）             |
| `align`   | `'center' \| 'top' \| 'bottom'`       | `'center'`   | 垂直对齐方式                             |
| `onClick` | `(ev: MouseEvent) => void`            | -            | 点击事件                                 |

## VBox 垂直堆叠盒子

将子模块从上往下垂直排列。由于块级元素默认就是垂直堆叠，`VBox` 适用于需要设置间隙、对齐或点击事件的场景。

```ts
import { VBox, Link, rem } from 'wok-ui'

new VBox({
  gap: rem(1),
  align: 'stretch',
  children: [
    new Link({ content: '热门资讯' }),
    new Link({ content: '代码人生' }),
    new Link({ content: '实用工具' }),
    new Link({ content: '人工智能' })
  ]
})
```

| 选项      | 类型                                  | 默认值       | 说明                                     |
| --------- | ------------------------------------- | ------------ | ---------------------------------------- |
| `children`| `SubModulesOpt`                       | 必填         | 子模块内容                               |
| `gap`     | `number`                              | -            | 子模块间垂直间隙（px）                   |
| `align`   | `'left' \| 'center' \| 'right' \| 'stretch'` | `'stretch'` | 横向对齐方式                             |
| `onClick` | `(ev: MouseEvent) => void`            | -            | 点击事件                                 |

## JustifyBox 两端对齐盒子

子模块均匀分布在左右两端（`justify-content: space-between`）。

```ts
import { JustifyBox, rem } from 'wok-ui'

new JustifyBox({
  align: 'top',
  children: [
    { children: ['79', rem(1), '文章'] },
    { children: ['163k', rem(1), '阅读'] },
    { children: ['256', rem(1), '粉丝'] }
  ]
})
```

| 选项      | 类型                                         | 默认值       | 说明                                     |
| --------- | -------------------------------------------- | ------------ | ---------------------------------------- |
| `children`| `SubModulesOpt`                              | 必填         | 子模块内容，由多个元素组成               |
| `align`   | `'center' \| 'top' \| 'bottom' \| 'stretch'` | `'stretch'`  | 垂直对齐方式                             |
| `onClick` | `(ev: MouseEvent) => void`                   | -            | 点击事件                                 |

## HSplitBox 左右分隔盒子

左右两部分，一侧固定宽度，另一侧占满剩余空间。

```ts
import { HSplitBox } from 'wok-ui'

new HSplitBox({
  gap: 12,
  align: 'top',
  fixedSide: 'left',
  left: { tag: 'img', classNames: 'avatar', attrs: { src: 'avatar-url' } },
  right: {
    classNames: 'comment',
    children: ['张三 发表于6分钟前', 8, '这篇文章不错，赞！']
  }
})
```

| 选项       | 类型                                      | 默认值       | 说明                                     |
| ---------- | ----------------------------------------- | ------------ | ---------------------------------------- |
| `left`     | `ConvertibleModule`                       | 必填         | 左侧内容                                 |
| `right`    | `ConvertibleModule`                       | 必填         | 右侧内容                                 |
| `fixedSide`| `'left' \| 'right'`                       | 必填         | 固定宽度的一侧                           |
| `gap`      | `number`                                  | -            | 左右间隙（px）                           |
| `align`    | `'center' \| 'top' \| 'bottom' \| 'stretch'` | `'stretch'` | 垂直对齐方式                             |
| `onClick`  | `(ev: MouseEvent) => void`                | -            | 点击事件                                 |

## VSplitBox 上下分隔盒子

上下两部分，一侧固定高度，另一侧占满剩余空间。需指定容器总高度。

```ts
import { VSplitBox } from 'wok-ui'

new VSplitBox({
  height: window.innerHeight,
  fixedSide: 'top',
  top: { classNames: 'header', innerText: '在线学习管理后台' },
  bottom: {
    classNames: 'body',
    children: [/* 主内容区 */]
  }
})
```

| 选项       | 类型                       | 默认值 | 说明                                     |
| ---------- | -------------------------- | ------ | ---------------------------------------- |
| `height`   | `number`                   | 必填   | 容器总高度（px）                         |
| `top`      | `ConvertibleModule`        | 必填   | 上方内容                                 |
| `bottom`   | `ConvertibleModule`        | 必填   | 下方内容                                 |
| `fixedSide`| `'top' \| 'bottom'`        | 必填   | 固定高度的一侧                           |
| `onClick`  | `(ev: MouseEvent) => void` | -      | 点击事件                                 |

## Grid 网格

将子模块按指定列数排列为网格，适用于列表布局。

```ts
import { Grid } from 'wok-ui'

new Grid({
  cols: 6,
  gap: 12,
  cellMinWidth: 200,
  cells: [
    { classNames: 'item', children: ['Java 编程思想（第4版）', '出版时间：2007-6'] },
    { classNames: 'item', children: ['Linux 程序设计（第4版）', '出版时间：2010-6'] }
    // ...
  ]
})
```

| 选项           | 类型                                  | 默认值 | 说明                                                         |
| -------------- | ------------------------------------- | ------ | ------------------------------------------------------------ |
| `cols`         | `number`                              | 必填   | 每行列数，1-12                                               |
| `cells`        | `SubModulesOpt`                       | 必填   | 单元格内容，按顺序排列                                       |
| `gap`          | `number \| { col: number; row: number }` | -   | 格间距（px），可分别设列间隙和行间隙                         |
| `cellMinWidth` | `number`                              | -      | 格子最小宽度（px），空间不足时提前换行，不保证每行列数        |

### 动态添加单元格

`Grid` 实例提供 `addCell` 方法，可动态追加单元格：

```ts
const grid = new Grid({ cols: 4, cells: [/* ... */] })
grid.addCell({ classNames: 'item', children: '新条目' })
```

## 布局组合示例

典型的管理后台页面布局——顶部 header + 左侧侧边栏 + 右侧主内容：

```ts
import { VSplitBox, HSplitBox } from 'wok-ui'

new VSplitBox({
  height: window.innerHeight,
  fixedSide: 'top',
  top: { classNames: 'header', children: '管理后台' },
  bottom: new HSplitBox({
    fixedSide: 'left',
    left: { classNames: 'sidebar', children: [/* 导航菜单 */] },
    right: { classNames: 'main', children: [/* 主内容区 */] }
  })
})
```
