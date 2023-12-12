# 动画

组件库预设了一些常用的动画效果，通过调用 animate 函数可以让指定的 dom 元素呈现出对应的动画。
动画在内置的模块中很多地方都有应用。

## 基本使用

让元素从顶部滑入。

```ts
animate({
  el,
  // 指定动画为 SLIDE_TOP
  animation: Animation.SLIDE_TOP,
  // 持续时间 3000 毫秒，即 3秒
  duration: 3000
})
```

animation 选项的值是枚举 Animation，所有受支持的动画如下。

| 枚举值                 | 说明       |
| :--------------------- | :--------- |
| Animation.FADE         | 淡入       |
| Animation.SCALE_UP     | 放大进入   |
| Animation.SCALE_DOWN   | 缩小       |
| Animation.SLIDE_TOP    | 从顶部滑入 |
| Animation.SLIDE_BOTTOM | 从底部滑入 |
| Animation.SLIDE_LEFT   | 从左侧滑入 |
| Animation.SLIDE_RIGHT  | 从右侧滑入 |
| Animation.SHAKE        | 摇晃       |

## 反向动画

通过将选项 reverse 设置为 true 可以让动画反方向进行，常用于退场。比如
一个元素是从顶部滑入入场的，在退场时再次同样调用 animation 函数，增加 reverse 选项
即可让元素向上从顶部滑出。同样的应用还有淡入淡出等，但是对摇晃（Animation.SHAKE）是没有用的。

```ts
// 让从顶部滑入的元素从顶部退出
animate({
  el,
  animation: Animation.SLIDE_TOP,
  duration: 3000,
  reverse: true
})
```

## 入场隐藏

如果一个元素本来就是显示的，然后再调用 animate 函数来执行入场动画，画面就会有闪烁和跳动。
必须要让元素隐藏起来，执行入场动画的时候才显示出来。通过给元素添加类 animation-provision
可以将元素隐藏，调用 animate 函数时会自动移除这个类，可通过常量 ANIMATION_PROVISION 来使用。

下面是一个模块中使用的示例。

```ts
class Modal extends DivModule {
  constructor() {
    // 添加隐藏样式
    super(ANIMATION_PROVISION, 'modal')
    this.addChild({
      className: 'header',
      children: [
        // 构建内容省略 ...
      ]
    })
  }

  mount(parentEl: Element): void {
    super.mount(parentEl)
    // 入场动画
    animate({
      el: this.el,
      animation: Animation.SLIDE_TOP,
      duration: 800
    })
  }

  destroy(): void {
    // 退场动画
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
