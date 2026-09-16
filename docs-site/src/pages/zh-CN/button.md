---
title: 按钮
order: 110
icon: fa-hand-pointer
description: 按钮组件的类型、尺寸与事件。
---

# 按钮

按钮是页面最常用的点按交互元素，对于一个网页来说绝大多数操作都是通过点按来进行的，所以组件库也提供了
丰富的按钮样式风格。

## 使用示例

通过构造 Button 类型实例来创建按钮。

```ts
new Button({
  // 按钮文字
  text: '开始吧！',
  // 类型，主题色按钮
  type: 'primary',
  // 描边样式，默认为 false ，表示填充风格
  outline: true,
  // 尺寸
  size: 'lg',
  // 处理点击事件
  onClick(ev) {
    // TODO 交互操作
  }
})
```

### 按钮类型

通过 `type` 设置按钮的用途类型。

```demo ../demos/button/types.ts
```

### 描边样式

设置 `outline: true` 使用镂空（描边）样式，适合有背景色填充的特殊场景。

```demo ../demos/button/outline.ts
```

### 禁用状态

```demo ../demos/button/disabled.ts
```

### 带图标

通过 `icon` 设置图标，`iconPosition` 控制图标位置。

```demo ../demos/button/icon.ts
```

### 不同大小

通过 `size` 设置尺寸，支持 `lg`、`sm`，默认为中等大小。

```demo ../demos/button/size.ts
```

### 块级按钮

设置 `block: true` 让按钮占满整行。

```demo ../demos/button/block.ts
```

按钮也被很多其它的内置组件所广泛使用，如模态框等。
