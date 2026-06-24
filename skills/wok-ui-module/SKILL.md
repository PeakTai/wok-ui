---
name: wok-ui-module
description: 指导如果在 wok-ui 构建一个自定义模块，遵守原则，动态构造内容，模块自身的生命周期管理等。当用户询问"如何扩展模块"、"新增模块"、"自定义模块行为"或"模块生命周期"时使用此技能。
license: MIT
metadata:
  author: Peak Tai
  email: peaktai@qq.com
---

# 构建模块

## 核心触发规则

- 用户提问包含："扩展模块"、"新增模块"、"自定义模块"、"模块生命周期"时触发

## 源码位置

安装 wok-ui 后，模块系统的源码位于项目中的 `node_modules/wok-ui/lib/` 目录下。
主要文件：
- `module.ts` — `Module` 基类、`DivModule`、`ConvertibleModule`、`SubModulesOpt`、`createDomModule`
- `render/full-rendering.ts` — `FullRenderingModule`
- `render/responsive.ts` — `ResponsiveModule`、`ResponsiveSize`、`ResponsiveBreakPoint`
- `render/cache.ts` — `Cache` 类

也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。

如果在 wok-ui 仓库本身，源码可直接在 `lib/` 目录下查看。

## 模块基础概念

模块是 wok-ui 中最基本的构建单位，是 DOM 元素的封装，用于快速复用常用的 DOM 组合。

## 模块构建原则

- 面向对象：模块是类，通过继承扩展，封装 DOM 行为和状态
- 封装性：不对外暴露 DOM 元素，通过方法间接操作状态和内容
- 最小API：只暴露必要方法和属性，避免暴露实现细节
- 无默认边距：通过垫片(Spacer模块)增加模块间间隙
- 实例唯一性：模块实例不可重复使用，如果参数是模块类型，复用需改为函数返回新实例
- 字面量构建：优先使用字面量方式动态构建内容，避免原生 DOM 操作
- 样式分离：禁止大量内嵌样式，样式应放在单独文件中

## 模块创建方法

### 继承 Module 基类

Module 是模块抽象类，所有自定义模块必须继承自它。构造器要求接收一个 `HTMLElement`：

```ts
import { Module } from 'wok-ui'

class MyModule extends Module {
  constructor() {
    super(document.createElement('div'))
    this.el.classList.add('my-module')
  }
}
```

### 继承 DivModule (推荐)

DivModule 是 Module 子类，自动创建 div 作为根元素，构造函数接收 CSS 类名：

```ts
import { DivModule } from 'wok-ui'

class MyModule extends DivModule {
  constructor() {
    super('my-module')
  }
}
```

## ConvertibleModule 可转换类型

很多 API 参数都接受 `ConvertibleModule` 类型，传入后会自动转换为模块。这大大简化了内容构建，省去大量样板代码。

| 类型               | 转换后的模块             | 示例                     |
| ------------------ | ------------------------ | ------------------------ |
| `string`           | 文本 span                | `'Hello World'`          |
| `number`           | 垂直间隙垫片（px）       | `16`                     |
| `HTMLElement`      | 基于元素的模块           | `document.createElement('hr')` |
| `Module`           | 直接使用，不做转换       | `new Text('Hi')`         |
| `() => Module`     | 延迟求值，执行后取模块   | `() => new SomeModule()` |
| `CreateDomModuleOptions` | 通过 `createDomModule` 创建 | 见下一节              |

```ts
this.addChild(
  '第一段文本',
  16,
  '第二段文本',
  document.createElement('hr'),
  16,
  '第三段文本'
)
```

## SubModulesOpt 子模块选项

`SubModulesOpt` 在 `ConvertibleModule` 基础上扩展，支持三种形态：

```ts
type SubModulesOpt =
  | ConvertibleModule                                    // 单个模块
  | ConvertibleModule[]                                  // 模块数组
  | ((addChild: (...child: SubModulesOpt[]) => void) => void)  // 回调动态添加
```

**单个模块**：当 `children` 只有一个子元素时，可省略数组包裹：

```ts
{ tag: 'div', children: '单行文本' }
{ tag: 'div', children: new SomeModule() }
```

**数组**：常规用法：

```ts
{ tag: 'div', children: ['文本1', 8, '文本2'] }
```

**回调函数**：适合需要条件判断动态构建的场景。函数参数 `add` 等同于 `addChild`，可在回调中写任意逻辑：

```ts
{
  tag: 'div',
  children: add => {
    if (showTitle) {
      add({ tag: 'h3', innerText: '标题' })
    }
    add('正文内容')
  }
}
```

## createDomModule 匿名模块

`createDomModule` 通过字面量参数快速创建匿名模块，是构建复杂 DOM 层级的核心工具。`CreateDomModuleOptions` 本身就是 `ConvertibleModule` 的一种，所以在任何接受 `ConvertibleModule` 的地方都可以直接用字面量，无需显式调用 `createDomModule`。

常用选项：

| 选项         | 类型                                     | 说明                         |
| ------------ | ---------------------------------------- | ---------------------------- |
| `tag`        | `string`                                 | HTML 标签名，默认 `div`      |
| `innerText`  | `string`                                 | 内部文本                     |
| `innerHTML`  | `string`                                 | 内部 HTML（`innerText` 优先）|
| `classNames` | `string \| string[]`                     | CSS 类名                     |
| `style`      | `Partial<CSSStyleDeclaration>`           | 行内样式                     |
| `attrs`      | `Record<string, string \| undefined \| boolean>` | HTML 属性          |
| `children`   | `SubModulesOpt`                          | 子模块                       |
| `onClick`    | `(ev: MouseEvent) => void`               | 点击事件                     |
| `events`     | `Record<string, (e: Event) => void>`     | 事件绑定                     |
| `preHandle`  | `(el: HTMLElement) => void`              | 元素创建后、属性赋值前回调   |
| `postHandle` | `(el: HTMLElement) => void`              | 属性赋值和子模块构造完成后回调 |

示例：

```ts
class Modal extends DivModule {
  constructor() {
    super('modal')
    this.addChild({
      classNames: 'modal-dialog',
      children: {
        classNames: 'modal-content',
        children: [
          {
            classNames: 'modal-header',
            children: { classNames: 'modal-title', innerText: '标题' }
          },
          {
            classNames: 'modal-body',
            children: new Text('内容...')
          },
          {
            classNames: 'modal-footer',
            style: { color: 'grey' },
            innerText: 'footer'
          }
        ]
      }
    })
  }
}
```

## 动态内容构建

通过 `addChild` 方法以字面量形式动态构建内容。

### 导航模块

```ts
import { DivModule } from 'wok-ui'

class Nav extends DivModule {
  constructor(opts: { items: string[]; activeIndex: number; onChange: (index: number) => void }) {
    super('nav')
    this.addChild({
      tag: 'ul',
      classNames: 'nav-items',
      children: opts.items.map((item, index) => ({
        tag: 'li',
        classNames: 'nav-item',
        children: {
          tag: 'a',
          classNames: ['nav-link', index === opts.activeIndex ? 'active' : ''],
          innerText: item,
          onClick: () => opts.onChange(index)
        }
      }))
    })
  }
}
```

### 图书列表（函数式条件构建）

```ts
import { DivModule, Spacer } from 'wok-ui'

class BookList extends DivModule {
  constructor(opts: { books: Book[] }) {
    super('book-list')
    for (const book of opts.books) {
      this.addChild({
        classNames: 'book-item',
        children: add => {
          if (book.coverUrl) {
            add({ tag: 'img', classNames: 'book-cover', attrs: { src: book.coverUrl } })
          }
          add(
            new Spacer('sm'),
            { classNames: 'book-title', innerText: book.title },
            new Spacer('sm'),
            { classNames: 'book-info', children: [book.author, book.year + ''] }
          )
        }
      })
    }
  }
}
```

## Module 基类工具方法

以下 protected 方法仅对子类开放：

| 方法                               | 说明                                 |
| ---------------------------------- | ------------------------------------ |
| `addChild(...child)`               | 添加子模块                           |
| `insertChild(index, child)`        | 指定位置插入子模块                   |
| `moveChild(fromIndex, toIndex)`    | 移动子模块位置                       |
| `removeChild(module \| index)`    | 移除指定子模块                       |
| `replaceChild(index, newChild)`    | 替换指定位置的子模块                 |
| `getChild(index): Module`          | 获取指定位置的子模块                 |
| `getChildren(): Module[]`          | 获取所有子模块                       |
| `getIndex(): number`               | 获取当前模块在兄弟中的索引           |
| `find<T>(predicate): T[]`          | 深度查找所有后代中符合条件的模块     |
| `findFirst<T>(predicate): T`       | 深度查找第一个符合条件的后代模块     |
| `empty()`                          | 清空所有子模块                       |

`find` 和 `findFirst` 用于在模块树中搜索特定类型的后代，常用于表单校验、批量操作等场景：

```ts
this.find<TextInput>(m => m instanceof TextInput).forEach(input => input.validate())
```

## 生命周期

模块的生命周期包括创建、挂载、销毁。

创建对应构建函数，挂载对应 `mount` 方法，销毁对应 `destroy` 方法。通过覆写这些方法可以自定义生命周期行为。

```ts
import { DivModule } from 'wok-ui'

class CountDownModule extends DivModule {
  private timer = 0
  constructor(private count: number) {
    super()
    this.el.innerText = `还剩 ${this.count} 秒`
  }

  mount(parentEl: Element): void {
    super.mount(parentEl)
    this.timer = setInterval(() => {
      this.count--
      this.el.innerText = `还剩 ${this.count} 秒`
      if (this.count <= 0) clearInterval(this.timer)
    }, 1000)
  }

  destroy(): void {
    clearInterval(this.timer)
    super.destroy()
  }
}
```

## 全量渲染

[FullRenderingModule](references/full-rendering.md) 适用于数据变化后需要整体重新渲染的场景。每次调用 `render()` 会清空内容并重新执行 `buildContent()`。

`render(immediate)` 支持参数：
- `immediate = false`（默认）：异步合并渲染，同一帧内多次调用只执行一次
- `immediate = true`：同步立即渲染，适合需要在渲染完成后立即执行后续逻辑的场景

详细用法见：[FullRenderingModule](references/full-rendering.md)

## 响应式渲染

[ResponsiveModule](references/responsive-rendering.md) 适用于需要根据窗口尺寸动态调整布局的场景。当窗口宽度跨越断点时自动重新渲染。

断点参照：

| 枚举值                        | 断点宽度 |
| ----------------------------- | -------- |
| `ResponsiveBreakPoint.sm`     | ≥ 576px  |
| `ResponsiveBreakPoint.md`     | ≥ 768px  |
| `ResponsiveBreakPoint.lg`     | ≥ 992px  |
| `ResponsiveBreakPoint.xl`     | ≥ 1200px |
| `ResponsiveBreakPoint.xxl`    | ≥ 1400px |

详细用法见：[ResponsiveModule](references/responsive-rendering.md)

## 模块缓存

`FullRenderingModule` 和 `ResponsiveModule` 均支持通过 `cacheModule` 方法缓存子模块。重新渲染时，被缓存的模块不会被销毁重建，保留原有状态和 DOM。这对于输入框等需要保持状态的模块非常有用。

```ts
this.addChild(
  this.cacheModule({
    key: 'filter',
    module: () => new Filter({ onSubmit: data => this.fetchData(data) })
  })
)
```

通过 `removeCache(key)` 清除单个缓存，通过 `clearCaches()` 清除全部缓存。

## 文件结构规范

### 基础结构

```
my-module/
├── index.ts      # 模块逻辑
└── style.less    # 模块样式
```

### 复杂模块结构

```
my-module/
├── index.ts
├── style.less
├── sub-module1/
│   ├── index.ts
│   └── style.less
└── sub-module2/
    ├── index.ts
    └── style.less
```

`index.ts` 通常做聚合导出：`export * from './xxx'`。样式文件使用 Less，通过 CSS 变量驱动主题。

## 更多参考

- [维持 DOM 元素的引用，调用原生 DOM API](references/dom.md)
- [模块间通讯](references/communication.md)
- [全量渲染模块](references/full-rendering.md)
- [响应式渲染模块](references/responsive-rendering.md)
- [重新渲染页面跳动问题](references/layout-jitter.md)
- [垫片使用说明](references/spacer.md)


## 更多参考示例

这些示例，可以作为常见模块的实现参考。

- [树](references/tree.md) — FullRenderingModule 递归构建树形结构，含选中、折叠、操作按钮
- [描述列表](references/description-list.md) — 基于 CSS Grid 的多列键值对布局
- [标签页](references/tabs.md) — FullRenderingModule + cacheModule 实现标签切换
- [分页器](references/pagination.md) — FullRenderingModule 实现页码导航
- [搜索框](references/search-box.md)
- [即时搜索](references/instant-search.md)
