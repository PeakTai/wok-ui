---
name: animation
description: 介绍 wok-ui 内置的 CSS 动画系统，包括预设动画类型、入场/退场动画、反向动画、入场隐藏以及 animate 函数的完整用法。
license: MIT
metadata:
  author: Peak Tai
  email: peaktai@qq.com
---

# 动画

wok-ui 内置了一套 CSS 动画系统，通过 `animate` 函数让任意 DOM 元素呈现预设的动画效果。动画在内置模块（如模态框、弹窗等）中被广泛使用。

> **源码位置**：安装 wok-ui 后，动画模块的源码和样式位于项目中的 `node_modules/wok-ui/lib/animation/` 目录下。
> 主要文件：
> - `index.ts` — `Animation` 枚举定义及 `animate` 函数实现
> - `animation.less` — 动画公共样式（时长、缓动函数、反向、隐藏）
> - `fade.less` — 淡入动画
> - `scale-up.less` — 放大进入动画
> - `scale-down.less` — 缩小动画
> - `slide-top.less` / `slide-bottom.less` / `slide-left.less` / `slide-right.less` — 滑入动画
> - `shake.less` — 摇晃动画
>
> 也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认动画相关的导出接口。
>
> 如果当前处于 wok-ui 仓库本身，源码可直接在 `lib/animation/` 目录下查看。

## 基础用法

调用 `animate` 函数并指定目标元素和动画类型，即可让元素执行动画：

```ts
import { animate, Animation } from 'wok-ui'

animate({
  el: document.querySelector('.box'),
  animation: Animation.SLIDE_TOP,
  duration: 3000 // 持续 3000 毫秒（3秒）
})
```

`animate` 函数返回 `Promise<void>`，在动画完成后 resolve，可用于编排动画序列：

```ts
await animate({ el: box1, animation: Animation.FADE })
// box1 淡入完成后，box2 再开始滑入
await animate({ el: box2, animation: Animation.SLIDE_LEFT })
```

## 动画类型

通过 `Animation` 枚举指定动画类型。`animation` 选项可传入单个动画或动画数组（组合动画）：

| 枚举值                   | 说明         |
| ------------------------ | ------------ |
| `Animation.FADE`         | 淡入         |
| `Animation.SCALE_UP`     | 放大进入     |
| `Animation.SCALE_DOWN`   | 缩小         |
| `Animation.SLIDE_TOP`    | 从顶部滑入   |
| `Animation.SLIDE_BOTTOM` | 从底部滑入   |
| `Animation.SLIDE_LEFT`   | 从左侧滑入   |
| `Animation.SLIDE_RIGHT`  | 从右侧滑入   |
| `Animation.SHAKE`        | 摇晃         |

```ts
// 单个动画
animate({ el, animation: Animation.FADE })

// 组合动画：同时淡入并从左侧滑入
animate({ el, animation: [Animation.FADE, Animation.SLIDE_LEFT] })
```

## 反向动画（退场）

将 `reverse` 设置为 `true`，动画会反向执行，通常用于元素退场。

```ts
// 元素从顶部滑入入场
await animate({ el, animation: Animation.SLIDE_TOP })

// 元素从顶部滑出退场
await animate({
  el,
  animation: Animation.SLIDE_TOP,
  reverse: true
})
```

支持反向的动画与入场对应：

- `FADE` → 淡出（反向即淡出）
- `SCALE_UP` → 缩小退出
- `SCALE_DOWN` → 放大退出
- `SLIDE_TOP` → 向顶部滑出
- `SLIDE_BOTTOM` → 向底部滑出
- `SLIDE_LEFT` → 向左侧滑出
- `SLIDE_RIGHT` → 向右侧滑出

> **注意**：`SHAKE`（摇晃）动画反向没有意义，使用 `reverse` 无效。

## 动画时长

通过 `duration` 选项设置动画持续时间（单位：毫秒），默认值为 `500`：

```ts
// 快速动画（200ms）
animate({ el, animation: Animation.FADE, duration: 200 })

// 慢速动画（1000ms）
animate({ el, animation: Animation.SLIDE_TOP, duration: 1000 })
```

## 入场隐藏

如果元素本来就在页面上可见，然后再调用 `animate` 执行入场动画，会出现画面闪烁——元素先显示出来，然后才以动画入场。

解决方案：在元素创建时就加上 `animation-provision` 类，将其隐藏。`animate` 函数开始执行时会自动移除该类。

通过常量 `ANIMATION_PROVISION` 使用该类名：

```ts
import { animate, Animation, ANIMATION_PROVISION } from 'wok-ui'

// 将 animation-provision 类添加到元素上，使其初始隐藏
const box = document.createElement('div')
box.className = ANIMATION_PROVISION
document.body.appendChild(box)

// animate 会自动移除 animation-provision 类，元素以动画形式出现
await animate({ el: box, animation: Animation.FADE })
```

在自定义模块中的典型用法：

```ts
import { DivModule, animate, Animation, ANIMATION_PROVISION } from 'wok-ui'

class Modal extends DivModule {
  constructor() {
    // 将 ANIMATION_PROVISION 作为 className 传入，元素初始为隐藏状态
    super(ANIMATION_PROVISION, 'modal')
    this.addChild({
      classNames: 'header',
      children: [
        // 构建模态框内容 ...
      ]
    })
  }

  mount(parentEl: Element): void {
    super.mount(parentEl)
    // 入场动画：从顶部滑入
    animate({
      el: this.el,
      animation: Animation.SLIDE_TOP,
      duration: 800
    })
  }

  destroy(): void {
    // 退场动画：向顶部滑出，动画完成后再销毁
    animate({
      el: this.el,
      animation: Animation.SLIDE_TOP,
      duration: 800,
      reverse: true
    }).then(() => {
      super.destroy()
    })
  }
}
```

## 在模块构造函数中配置入场隐藏

对于继承 `DivModule` 的模块，可以直接在 `super()` 调用中传入 `ANIMATION_PROVISION`：

```ts
import { DivModule, ANIMATION_PROVISION } from 'wok-ui'

class MyPanel extends DivModule {
  constructor() {
    // 第一个参数即为 className，传入 ANIMATION_PROVISION 隐藏元素
    super(ANIMATION_PROVISION, 'my-panel')
    // ... 构建内容
  }
}
```

## 完整选项参考

`animate` 函数接受以下选项：

| 选项        | 类型                        | 默认值 | 说明                                   |
| ----------- | --------------------------- | ------ | -------------------------------------- |
| `el`        | `HTMLElement`               | 必填   | 执行动画的目标 DOM 元素                |
| `animation` | `Animation \| Animation[]`  | 必填   | 动画类型，单个或组合                    |
| `reverse`   | `boolean`                   | `false` | 是否反向执行动画                       |
| `duration`  | `number`                    | `500`  | 动画持续时间（毫秒）                   |

`animate` 返回 `Promise<void>`，动画完成后 resolve。

## 导出清单

从 `wok-ui` 中可导入以下动画相关内容：

| 导出                   | 类型                  | 说明                         |
| ---------------------- | --------------------- | ---------------------------- |
| `animate`              | 函数                  | 执行动画                     |
| `Animation`            | 枚举                  | 预设动画类型                 |
| `ANIMATION_PROVISION`  | 字符串常量            | 入场隐藏的 class 名称        |
