# 垫片

绝大部分情况下，页面中的不同模块间都需要有间隙。常见的做法是使用 `margin`，但如果每个模块都要支持设置外边距参数，会产生大量重复代码且不够优雅。

wok-ui 推荐使用**垫片（Spacer）**来管理模块间间隙。垫片是一个独立的模块，专门用于增加间距，这样功能模块就不需要关注间隙问题，可以更好地进行复用。

## 垂直垫片 Spacer

使用 `Spacer` 模块可以在垂直方向上增加间隙。

```ts
import { Spacer } from 'wok-ui'

// 自定义像素值
new Spacer(24)

// 默认间距，高度为 1rem
new Spacer('normal')

// 小号间距，高度为 0.5rem
new Spacer('sm')

// 大号间距，高度为 2rem
new Spacer('lg')

// 不传参数，等价于 'normal'
new Spacer()
```

### 在模块中使用

```ts
import { DivModule, Spacer } from 'wok-ui'

class MySection extends DivModule {
  constructor() {
    super('my-section')
    this.addChild(
      '标题文字',
      new Spacer('sm'),
      '描述内容',
      new Spacer('normal'),
      '更多信息'
    )
  }
}
```

## 水平垫片 HSpacer

`HSpacer` 用于在水平方向的行内元素间增加间隙，参数和 `Spacer` 完全一致。

```ts
import { HSpacer } from 'wok-ui'

new HSpacer(33)
new HSpacer('normal')
new HSpacer('sm')
new HSpacer('lg')
```

### 在布局中使用

```ts
import { HBox, HSpacer } from 'wok-ui'

new HBox({
  children: [
    '左',
    new HSpacer('sm'),
    '中',
    new HSpacer('lg'),
    '右'
  ]
})
```

## 预设尺寸对照

| 预设值     | 高度/宽度 |
| ---------- | --------- |
| `'sm'`     | `0.5rem`  |
| `'normal'` | `1rem`    |
| `'lg'`     | `2rem`    |
| 自定义数值 | 指定 px   |
