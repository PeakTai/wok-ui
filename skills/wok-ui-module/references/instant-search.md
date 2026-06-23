# 即时搜索场景

用户一边输入一边实时更新搜索结果的场景。由于 wok-ui 没有虚拟 DOM，全量 `render()` 会销毁重建所有子模块 DOM，导致输入框丢失焦点和光标。以下是解决该问题的架构模式。

## 核心思路：分层解耦

将输入框和结果列表放在不同的模块中，**仅对结果列表做全量渲染**，输入框所在的父容器不调用 `render()`。

```
Page (DivModule, 不 render)
├── SearchBox (输入框，保持存活)
└── ResultList (FullRenderingModule, 数据变化时 render)
```

## 完整示例

```ts
import { DivModule, FullRenderingModule } from 'wok-ui'

// --- 结果列表：独立做全量渲染 ---
class ResultList extends FullRenderingModule {
  private results: string[] = []

  constructor() {
    super('result-list')
    this.render()
  }

  updateResults(results: string[]) {
    this.results = results
    this.render()   // 仅重建 ResultList 内部，不影响 Page 中的输入框
  }

  protected buildContent(): void {
    if (this.results.length === 0) {
      this.addChild({ classNames: 'empty', innerText: '暂无结果' })
      return
    }
    for (const item of this.results) {
      this.addChild({ classNames: 'result-item', children: item })
    }
  }
}

// --- 页面：持有引用，不作为 render ---
class Page extends DivModule {
  private resultList: ResultList

  constructor() {
    super('page')
    this.addChild(
      {
        tag: 'input',
        attrs: { type: 'text', placeholder: '输入关键词搜索' },
        postHandle: el => {
          el.addEventListener('input', () => {
            const keyword = (el as HTMLInputElement).value.trim()
            this.onSearch(keyword)
          })
        }
      },
      (this.resultList = new ResultList())
    )
  }

  private onSearch(keyword: string) {
    // 调用子模块的公开方法，子模块内部自行 render
    fetchList(keyword).then(data => {
      this.resultList.updateResults(data)
    })
  }
}
```

## 关键点

- `Page` 是普通的 `DivModule`，构建完后不再 `render()`——输入框不会重建
- `ResultList` 继承 `FullRenderingModule`，通过 `updateResults` 方法接收数据并自行 `render()`
- `render()` 的破坏范围仅限于 `ResultList` 自身的子节点，不影响同级的 `SearchBox`
- 如果搜索结果区也有需要缓存的输入/交互组件，可在 `ResultList` 内继续使用 `cacheModule`
