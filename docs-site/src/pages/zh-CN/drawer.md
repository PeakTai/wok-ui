---
title: 抽屉
order: 170
icon: fa-bars
description: 抽屉组件的使用。
---

# 抽屉

抽屉组件是贴边的弹窗，选项比模态框要简单一些，用于打开菜单或提示等。

## 基本使用

通过 showDrawer 函数可以构建一个抽屉模块并展示。

```ts
showDrawer({
  title: '这个是标题，可选',
  body: '要展示的内容',
  onClose() {
    showWarning('抽屉已经关闭')
  }
})
```

抽屉目前不支持按钮，有需要可在 body 中自定义。也不支持类似模态框将整个内容覆盖和静态背景的功能。

### 无标题抽屉

title 是可选的，不传则不显示标题栏。

```demo ../demos/drawer/no-title.ts
```

## 位置

通过 placement 选项可以控制抽屉出现的位置。

```ts
showDrawer({
  title: '上边',
  // 'left' | 'right' | 'top' | 'bottom'
  placement: 'top',
  body: '将从顶部弹出'
})
```

```demo ../demos/drawer/placement.ts
```

### 自定义宽度

通过 width 选项自定义抽屉宽度，仅对左侧和右侧的抽屉有效。

```demo ../demos/drawer/width.ts
```

## 句柄控制

和模态框一样，showDrawer 函数也返回一个对象，带有 close 方法，可用于实现自定义方式来关闭。

```ts
const drawer = showDrawer({
  placement: 'left',
  body: new Button({
    text: '点击关闭抽屉',
    onClick(ev) {
      drawer.close()
    }
  })
})
```

```demo ../demos/drawer/handle-close.ts
```

## 多抽屉叠加

抽屉可以叠加开启多个，点击背景会按照开启的顺序倒序逐个关闭。

```demo ../demos/drawer/stacked.ts
```

## 完全自定义内容

设置 replaceByBody: true 后，body 将替换整个抽屉内容区域，适合高度自定义的场景。

```demo ../demos/drawer/custom-body.ts
```

## 嵌入表单

抽屉内可以嵌入表单，并通过 onShown 回调在入场动画完成后自动聚焦输入框。

```demo ../demos/drawer/with-form.ts
```
