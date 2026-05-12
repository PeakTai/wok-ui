---
name: wok-ui-drawer
description: 介绍 wok-ui 抽屉组件的使用方法，包括基本展示、位置控制、句柄关闭、完全自定义内容等功能。
license: MIT
metadata:
  author: Peak Tai
  email: pektai@qq.com
---

# 抽屉

通过 `showDrawer` 函数快速创建一个贴边弹出的抽屉面板，常用于菜单、设置面板或辅助提示。

> **源码位置**：安装 wok-ui 后，源码位于 `node_modules/wok-ui/lib/drawer/index.ts`，样式位于 `node_modules/wok-ui/lib/drawer/style.less`。也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。如果在 wok-ui 仓库本身，源码在 `lib/drawer/` 目录下。

## 基本使用

```ts
import { showDrawer } from 'wok-ui'

showDrawer({
  title: '标题（可选）',
  body: '要展示的内容',
  onClose() {
    console.log('抽屉已关闭')
  }
})
```

`showDrawer` 返回一个包含 `close()` 方法的 `Drawer` 对象。

## 弹出位置

通过 `placement` 选项控制抽屉出现的位置：

```ts
// 从右侧滑入（默认）
showDrawer({ placement: 'right', body: '右侧抽屉' })

// 从左侧滑入
showDrawer({ placement: 'left', body: '左侧抽屉' })

// 从顶部滑入
showDrawer({ placement: 'top', body: '顶部抽屉' })

// 从底部滑入
showDrawer({ placement: 'bottom', body: '底部抽屉' })
```

| 位置        | 动画效果               |
| ----------- | ---------------------- |
| `'right'`   | 从右侧滑入（默认）     |
| `'left'`    | 从左侧滑入             |
| `'top'`     | 从顶部滑入             |
| `'bottom'`  | 从底部滑入             |

## 自定义宽度

仅对左侧和右侧抽屉有效：

```ts
showDrawer({
  placement: 'left',
  width: 320,
  body: '自定义宽度的左侧抽屉'
})
```

## 句柄关闭

通过返回对象的 `close()` 方法手动关闭：

```ts
const drawer = showDrawer({
  placement: 'left',
  body: new Button({
    text: '点击关闭抽屉',
    onClick: () => drawer.close()
  })
})
```

## 完全自定义内容

`replaceByBody: true` 让 body 替换整个抽屉内容区域：

```ts
showDrawer({
  replaceByBody: true,
  body: {
    classNames: 'custom-drawer',
    children: [/* 完全自定义的内容 */]
  }
})
```

## 完整选项参考

| 选项           | 类型                                         | 默认值    | 说明                                   |
| -------------- | -------------------------------------------- | --------- | -------------------------------------- |
| `placement`    | `'left' \| 'right' \| 'top' \| 'bottom'`     | `'right'` | 抽屉弹出位置                           |
| `title`        | `string`                                     | -         | 标题（不传不显示标题栏）               |
| `body`         | `SubModulesOpt`                              | 必填      | 正文内容                               |
| `width`        | `number`                                     | `400`     | 宽度（仅 left/right 有效）             |
| `replaceByBody`| `boolean`                                    | `false`   | 是否用 body 替换整个抽屉内容           |
| `onClose`      | `() => void`                                 | -         | 关闭回调                               |
| `onShown`      | `() => void`                                 | -         | 入场动画完成后回调                     |
