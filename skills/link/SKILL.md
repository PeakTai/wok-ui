---
name: link
description: 介绍 wok-ui 链接模块的使用方法，包括基本链接、点击事件、打开方式、下载链接等功能。
license: MIT
metadata:
  author: Peak Tai
  email: peaktai@qq.com
---

# 链接

wok-ui 提供了 `Link` 模块用于创建链接，支持 URL 跳转、点击事件回调、打开方式和下载等完整功能。

> **源码位置**：安装 wok-ui 后，链接模块的源码位于项目中的 `node_modules/wok-ui/lib/link/` 目录下。
> 主要文件：
> - `index.ts` — `Link` 链接类实现
> - `style.less` — 链接样式（含 hover、visited、active 状态）
>
> 也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。
>
> 如果当前处于 wok-ui 仓库本身，源码可直接在 `lib/link/` 目录下查看。

## 基本使用

`Link` 会生成 `<a>` 标签，默认使用主题色：

```ts
import { Link } from 'wok-ui'

new Link({
  content: '访问官网',
  url: 'https://example.com'
})
```

## URL 跳转

通过 `url` 选项设置链接地址：

```ts
new Link({
  content: '打开文档',
  url: '/docs/getting-started'
})
```

## 点击事件

通过 `onClick` 选项绑定点击回调。当设置了 `onClick` 后，会自动阻止默认跳转行为，使用 `javascript:;` 作为 `href`：

```ts
import { Link, showSuccess } from 'wok-ui'

new Link({
  content: '点击操作',
  onClick(ev) {
    showSuccess('链接被点击了')
  }
})
```

适合用作表格中的操作列、导航菜单等场景：

```ts
import { Link, TableColumn } from 'wok-ui'

new TableColumn({
  name: '操作',
  content: user =>
    new Link({
      content: user.status === '激活' ? '冻结' : '激活',
      onClick: () => {
        user.status = user.status === '激活' ? '冻结' : '激活'
      }
    })
})
```

## 打开方式

通过 `target` 选项控制链接打开的目标窗口：

| 值       | 说明                   |
| -------- | ---------------------- |
| `'self'` | 在当前窗口打开（默认） |
| `'blank'`| 在新窗口/标签页打开    |
| `'parent'`| 在父框架中打开        |
| `'top'`  | 在顶层框架中打开       |

```ts
// 新窗口打开
new Link({
  content: '在新标签页打开',
  url: 'https://example.com',
  target: 'blank'
})
```

## 下载链接

通过 `download` 选项设置下载文件名，浏览器会触发文件下载而非页面跳转：

```ts
new Link({
  content: '下载报告',
  url: '/files/report.pdf',
  download: '年度报告.pdf'
})
```

## triggerClick 方法

通过 `triggerClick()` 方法可以程序化触发链接的点击，适用于一些特殊场景（需注意浏览器兼容性，建议优先让用户主动点击）：

```ts
const link = new Link({
  content: '触发下载',
  url: '/files/data.csv',
  download: 'data.csv'
})

// 程序触发点击
link.triggerClick()
```

| 方法              | 说明                                      |
| ----------------- | ----------------------------------------- |
| `triggerClick()`  | 程序化触发点击，返回 `this` 支持链式调用  |

## 完整选项参考

| 选项       | 类型                                    | 默认值 | 说明                                   |
| ---------- | --------------------------------------- | ------ | -------------------------------------- |
| `content`  | `ConvertibleModule`                     | 必填   | 链接内容，可以是字符串或任意模块       |
| `url`      | `string`                                | -      | 跳转地址                               |
| `onClick`  | `(ev: MouseEvent) => void`              | -      | 点击事件，设置后阻止默认跳转           |
| `target`   | `'self' \| 'blank' \| 'parent' \| 'top'` | -      | 打开方式                               |
| `download` | `string`                                | -      | 下载文件名，设置后触发下载行为         |

> `url` 和 `onClick` 可只设其一。只有 `onClick` 时链接 `href` 为 `javascript:;`，即点击无跳转行为。
