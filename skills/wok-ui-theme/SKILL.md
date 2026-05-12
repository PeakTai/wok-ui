---
name: wok-ui-theme
description: 介绍 wok-ui 主题定制模块的使用方法，包含颜色变量、尺寸设置等全部功能选项。
license: MIT
metadata:
  author: Peak Tai
  email: peaktai@qq.com
---

# 主题定制

## 颜色定制

通过框架提供的 `setColor` 函数，可以设置框架的颜色变量。

```typescript
import { setColor } from 'wok-ui'

setColor({
  primary: '#2d7ee9',
  success: '#0f6e3f',
  danger: '#c33535',
  warning: '#b45b0a',
  border: '#e6edf5',
  text: '#0c2a4b',
  textSecondary: '#1d3a5c',
  outline: '#c7ddff'
})
```

调用 `setColor` 后，对应的 CSS 变量会被立即更新，页面中使用这些变量的组件会即时响应颜色变化。

### 重置颜色

通过 `resetColor` 函数，可以将颜色设置复原为默认值：

```ts
import { resetColor } from 'wok-ui'

resetColor()
```

### 获取当前颜色

通过 `getColor` 函数获取当前的颜色信息：

```ts
import { getColor } from 'wok-ui'

const { primary, danger, success } = getColor()
```

### 颜色参数说明

| 参数           | 说明                                 |
| -------------- | ------------------------------------ |
| `primary`      | 主要颜色，用于按钮、链接等主要操作   |
| `success`      | 成功颜色，用于表示成功操作           |
| `danger`       | 危险颜色，用于表示危险操作           |
| `warning`      | 警告颜色，用于表示警告操作           |
| `border`       | 边框颜色，用于边框元素               |
| `text`         | 文本颜色，用于文本元素               |
| `textSecondary`| 二级文本颜色，比 text 更淡一些       |
| `outline`      | 轮廓颜色，用于元素获取焦点时的描边   |

### CSS 变量对照

| CSS 变量                 | 属性名称       | 说明                   |
| ------------------------ | -------------- | ---------------------- |
| `--color-primary`        | `primary`      | 主题色，默认蓝色       |
| `--color-danger`         | `danger`       | 危险色，默认红色       |
| `--color-success`        | `success`      | 成功色，默认绿色       |
| `--color-warning`        | `warning`      | 警告色，默认橙色       |
| `--color-border`         | `border`       | 边框色，默认浅灰       |
| `--color-text`           | `text`         | 文字颜色，默认黑色     |
| `--color-text-secondary` | `textSecondary`| 次级文字颜色，默认深灰 |
| `--color-outline`        | `outline`      | 轮廓描边色，默认浅蓝   |

## 尺寸定制

wok-ui 有统一的尺寸管理，通过 CSS 变量驱动。所有内置组件都应用了这套尺寸设置，涉及尺寸大小的属性统一使用像素（px）为单位。

### 设置尺寸

通过 `setSize` 函数可以更改默认的尺寸信息：

```ts
import { setSize } from 'wok-ui'

setSize({
  text: 16,         // 默认文字大小，默认 16px（即 1rem）
  textSm: 14,       // 小号文字大小，默认 12px
  textLg: 18,       // 大号文字大小，默认 20px
  textXl: 22,       // 超大号文字大小，默认 24px
  borderRadius: 5   // 圆角半径，默认 6px
})
```

调用 `setSize` 后，CSS 变量会被立即改变，部分模块可能会立即响应变化，但依赖 API 的实现不会即时响应，最好重新渲染页面。

### 重置尺寸

由于修改尺寸具有危险性，操作不当可能导致混乱。可以通过 `resetSize` 函数恢复默认尺寸：

```ts
import { resetSize } from 'wok-ui'

resetSize()
```

### 获取当前尺寸

通过 `getSize` 函数获取当前的尺寸信息：

```ts
import { getSize } from 'wok-ui'

const { text, textSm, textLg, textXl, borderRadius } = getSize()
```

### CSS 变量对照

| CSS 变量              | 属性名称       | 意义                        |
| --------------------- | -------------- | --------------------------- |
| `--size-text`         | `text`         | 默认文字大小                |
| `--size-text-sm`      | `textSm`       | 小号文字大小                |
| `--size-text-lg`      | `textLg`       | 大号文字大小                |
| `--size-text-xl`      | `textXl`       | 超大号文字大小              |
| `--size-border-radius`| `borderRadius` | 圆角半径                    |

### rem 转换函数

组件库提供了一个 `rem` 函数，用于在构建 DOM 时转换 rem 单位：

```ts
import { rem, createDomModule } from 'wok-ui'

createDomModule({
  children: ['第一段文字', rem(1), '第二段文字，与第一段间隙 1rem']
})
```

## 源码位置

安装 wok-ui 后，相关源码位于：
- 颜色：`node_modules/wok-ui/lib/color/`
- 尺寸：`node_modules/wok-ui/lib/size/`
- 类型定义：`node_modules/wok-ui/types/index.d.ts`

如果在 wok-ui 仓库本身，源码在 `lib/color/` 和 `lib/size/` 目录下。
