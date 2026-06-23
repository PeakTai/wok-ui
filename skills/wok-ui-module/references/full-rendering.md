# FullRenderingModule 全量渲染

当模块内容需要根据数据变化整体重新渲染时，使用 `FullRenderingModule`。每次调用 `render()` 会先清空所有子模块内容，再重新执行 `buildContent()`。

> **源码位置**：安装 wok-ui 后，源码位于 `node_modules/wok-ui/lib/render/full-rendering.ts`，缓存实现位于 `node_modules/wok-ui/lib/render/cache.ts`。也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。如果在 wok-ui 仓库本身，源码在 `lib/render/` 目录下。

## 基本用法

继承 `FullRenderingModule`，实现 `buildContent()` 方法，在数据变化时调用 `render()`。

`FullRenderingModule` 默认创建 div 作为根元素，构造函数可传入 CSS 类名或自定义 `HTMLElement`。

### 基础示例：倒计时

```ts
import { FullRenderingModule } from 'wok-ui'

class Countdown extends FullRenderingModule {
  private timer: number

  constructor(private count: number) {
    super('countdown')
    this.render()
    this.timer = setInterval(() => {
      if (this.count <= 0) {
        clearInterval(this.timer)
        return
      }
      this.count--
      this.render()
    }, 1000)
  }

  protected buildContent(): void {
    this.addChild(`${this.count}`)
  }

  destroy() {
    clearInterval(this.timer)
    super.destroy()
  }
}
```

## render() 方法参数

`render(immediate?)` 方法支持一个可选参数：

| 参数        | 类型      | 默认值  | 说明                                         |
| ----------- | --------- | ------- | -------------------------------------------- |
| `immediate` | `boolean` | `false` | 是否立即同步渲染                             |

- **`render()` 或 `render(false)`**：异步渲染。同一事件循环中多次调用 `render()` 会被合并为一次，减少不必要的重复渲染。
- **`render(true)`**：同步立即渲染。调用后 `buildContent()` 会马上执行，适合渲染完成后需要立即读取 DOM 或依赖渲染结果的场景。

```ts
// 异步渲染（常规用法）
this.data = newData
this.render()

// 同步渲染（需要等待结果时）
this.render(true)
// 此时 DOM 已更新，可以安全读取
const height = this.el.scrollHeight
```

## 保留输入状态的场景

由于框架没有虚拟 DOM，`buildContent()` 每次调用都会重建整个 DOM。如果渲染区域内包含输入框等需要保留用户状态的元素（比如搜索输入、表单等），三种方式可以处理：

- **缓存输入组件**：用 `cacheModule` 将输入模块缓存，使其在 `render()` 时不被销毁重建（见下方"模块缓存"）
- **局部刷新**：不调用 `render()`，改为持有子模块引用，直接调用子模块方法局部更新内容（见[模块间通讯](./communication.md)）
- **分层解耦**：将输入框和结果区分开放到不同模块，仅对结果列表做全量渲染，输入框所在容器不 render（见[即时搜索场景](./instant-search.md)）

## 模块缓存

`FullRenderingModule` 内置了模块缓存机制，通过 `cacheModule` 方法可以让指定子模块在重新渲染时不被销毁重建，保留其内部状态和 DOM 结构。

```ts
this.addChild(
  // 被缓存的 filter 模块，重新渲染时不会重建
  this.cacheModule({
    key: 'filter',
    module: () => new Filter({
      onSubmit: data => this.fetchData(data)
    })
  })
)
```

| 方法                  | 说明                     |
| --------------------- | ------------------------ |
| `cacheModule(opts)`   | 缓存模块，返回可复用的模块实例 |
| `removeCache(key)`    | 移除指定 key 的缓存      |
| `clearCaches()`       | 清除所有缓存             |

`cacheModule` 会在首次调用时创建模块实例，后续调用返回同一实例。缓存的模块在 `FullRenderingModule` 销毁时一起销毁。

## 完整示例：数据列表

```ts
import { FullRenderingModule, showLoading, showWarning, hideLoading, SubModulesOpt } from 'wok-ui'

interface ListItem {
  id: string
  title: string
}

class Filter extends DivModule {
  constructor(opts: { onSubmit: (data: { keyword: string }) => void }) {
    super('filter')
    // 过滤表单逻辑省略...
  }
}

class Page extends FullRenderingModule {
  private list: ListItem[] = []
  private formData = { keyword: '' }

  constructor() {
    super('page')
    this.fetchData()
  }

  private fetchData() {
    showLoading()
    fetchList(this.formData)
      .then(res => {
        this.list = res
        this.render()
      })
      .catch(showWarning)
      .finally(hideLoading)
  }

  protected buildContent(): void {
    // 过滤模块被缓存，重新渲染时保留输入状态
    this.addChild(
      this.cacheModule({
        key: 'filter',
        module: () =>
          new Filter({
            onSubmit: data => {
              this.formData = data
              this.fetchData()
            }
          })
      })
    )
    // 列表内容
    for (const item of this.list) {
      this.addChild(this.buildListItem(item))
    }
  }

  private buildListItem(item: ListItem): SubModulesOpt {
    return { classNames: 'list-item', children: item.title }
  }
}
```

在这个示例中：
- 数据从服务端获取后调用 `this.render()` 全量刷新
- `Filter` 模块通过 `cacheModule` 缓存，重新渲染时输入状态不会丢失
- 列表部分的 DOM 每次都会重建
