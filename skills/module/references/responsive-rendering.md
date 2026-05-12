# ResponsiveModule 响应式渲染

当模块布局需要根据浏览器窗口宽度动态调整时，使用 `ResponsiveModule`。窗口宽度跨越断点时，模块会自动重新渲染。

> **源码位置**：安装 wok-ui 后，源码位于 `node_modules/wok-ui/lib/render/responsive.ts`，缓存实现位于 `node_modules/wok-ui/lib/render/cache.ts`。也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。如果在 wok-ui 仓库本身，源码在 `lib/render/` 目录下。

## 响应式断点

`ResponsiveModule` 通过 `ResponsiveSize` 类型和 `ResponsiveBreakPoint` 枚举定义断点：

| `ResponsiveSize` | `ResponsiveBreakPoint` 枚举 | 触发条件    |
| ---------------- | --------------------------- | ----------- |
| `'xs'`           | -                           | < 576px     |
| `'sm'`           | `ResponsiveBreakPoint.sm`   | ≥ 576px     |
| `'md'`           | `ResponsiveBreakPoint.md`   | ≥ 768px     |
| `'lg'`           | `ResponsiveBreakPoint.lg`   | ≥ 992px     |
| `'xl'`           | `ResponsiveBreakPoint.xl`   | ≥ 1200px    |
| `'xxl'`          | `ResponsiveBreakPoint.xxl`  | ≥ 1400px    |

窗口宽度变化时，仅当 `ResponsiveSize` 发生变化才会触发重新渲染。

## 基本用法

继承 `ResponsiveModule`，实现带 `sizeInfo` 参数的 `buildContent()` 方法。`ResponsiveModule` 默认创建 div 作为根元素，构造函数可传入 CSS 类名或自定义 `HTMLElement`。

```ts
import { ResponsiveModule, ResponsiveSize, Grid } from 'wok-ui'

class Page extends ResponsiveModule {
  constructor() {
    super('page')
    this.render()
  }

  buildContent(sizeInfo: { respSize: ResponsiveSize; windowWidth: number }): void {
    let cols = 2
    switch (sizeInfo.respSize) {
      case 'xs': cols = 2; break
      case 'sm': cols = 3; break
      case 'md': cols = 4; break
      case 'lg': cols = 5; break
      case 'xl': cols = 6; break
      case 'xxl': cols = 7; break
    }
    this.addChild(new Grid({ cols, cells: [/* ... */] }))
  }
}
```

## render() 方法参数

`render(force?, immediate?)` 方法支持两个可选参数：

| 参数        | 类型      | 默认值  | 说明                                         |
| ----------- | --------- | ------- | -------------------------------------------- |
| `force`     | `boolean` | `true`  | 是否强制渲染，`false` 时仅在尺寸变化时渲染   |
| `immediate` | `boolean` | `false` | 是否立即同步渲染，`true` 则跳过异步合并      |

```ts
// 常规用法：窗口 resize 自动触发，无需手动调用
// 手动强制重新渲染
this.render(true)

// 仅在断点变化时才渲染（非强制）
this.render(false)
```

> **注意**：窗口 resize 监听由 `ResponsiveModule` 内部自动处理，销毁时会自动移除。

## 模块缓存

与 `FullRenderingModule` 一样，`ResponsiveModule` 也支持 `cacheModule` 缓存子模块：

```ts
this.addChild(
  this.cacheModule({
    key: 'sidebar',
    module: () => new Sidebar()
  })
)
```

| 方法                  | 说明                     |
| --------------------- | ------------------------ |
| `cacheModule(opts)`   | 缓存模块，返回可复用的模块实例 |
| `removeCache(key)`    | 移除指定 key 的缓存      |
| `clearCaches()`       | 清除所有缓存             |

## 完整示例：响应式卡片网格

```ts
import { ResponsiveModule, ResponsiveSize } from 'wok-ui'

interface Card {
  title: string
  content: string
}

class CardGrid extends ResponsiveModule {
  constructor(private cards: Card[]) {
    super('card-grid')
    this.render()
  }

  buildContent(sizeInfo: { respSize: ResponsiveSize; windowWidth: number }): void {
    // 根据窗口尺寸动态调整每行卡片数
    let cols: number
    switch (sizeInfo.respSize) {
      case 'xs': cols = 1; break
      case 'sm': cols = 2; break
      case 'md': cols = 3; break
      case 'lg': cols = 4; break
      case 'xl': cols = 5; break
      case 'xxl': cols = 6; break
    }

    this.addChild({
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: '1rem'
      },
      children: this.cards.map(card => ({
        classNames: 'card',
        children: [
          { tag: 'h3', innerText: card.title },
          { tag: 'p', innerText: card.content }
        ]
      }))
    })
  }
}
```
