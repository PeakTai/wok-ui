# 模块间通讯

模块间通讯遵循一个原则：**子模块通过回调向上报告事件，父模块通过方法调用向下操作子模块**。兄弟模块之间绝不直接相互调用。

wok-ui 没有响应式状态管理。数据变化时有两种处理方式：
- **全量重渲染**：父模块保持数据，变化时整个父模块重新 `render()`，最简单
- **局部刷新**：父模块持有子模块引用（或通过 `find` 定位），调用子模块的公开方法局部更新，适合需要保留输入状态的场景

## 方式一：持有引用调用方法

父模块在构造函数中持有子模块的引用，回调触发时调用子模块的公开方法。

```ts
import { DivModule, FullRenderingModule } from 'wok-ui'

class SearchBox extends DivModule {
  private input!: HTMLInputElement

  constructor(opts: { onSearch: (query: string) => void }) {
    super('search-box')
    this.addChild({
      tag: 'input',
      attrs: { type: 'text', placeholder: '请输入搜索内容' },
      postHandle: el => {
        this.input = el as HTMLInputElement
        el.addEventListener('input', () => opts.onSearch(this.input.value))
      }
    })
  }
}

class List extends FullRenderingModule {
  private data: any[] = []

  constructor() {
    super('list')
    this.fetchData()
  }

  private async fetchData(keyword = '') {
    this.data = await fetch('/api/list?q=' + keyword).then(r => r.json())
    this.render()
  }

  search(keyword: string) {
    this.fetchData(keyword)
  }

  protected buildContent(): void {
    this.data.forEach(item =>
      this.addChild({ classNames: 'list-item', children: item.title })
    )
  }
}

class Page extends DivModule {
  private list: List

  constructor() {
    super('page')
    this.addChild(
      new SearchBox({
        onSearch: query => this.list.search(query)
      }),
      (this.list = new List())
    )
  }
}
```

## 方式二：通过 find 定位子模块

当子模块数量很多、不方便逐个持有引用时，通过 `find` 方法按类型或属性搜索后代模块。

```ts
import { DivModule, FullRenderingModule } from 'wok-ui'

interface QuestionData {
  id: number
  title: string
}

class AnswerCard extends DivModule {
  constructor(opts: { list: QuestionData[]; onSelect: (index: number) => void }) {
    super('answer-card')
    this.addChild(
      opts.list.map((q, i) => ({
        tag: 'button',
        innerText: `${i + 1}`,
        onClick: () => opts.onSelect(i)
      }))
    )
  }
}

class QuestionItem extends DivModule {
  readonly index: number

  constructor(opts: { data: QuestionData; index: number }) {
    super('question-item')
    this.index = opts.index
    this.addChild({ tag: 'h3', innerText: `第${opts.index + 1}题：${opts.data.title}` })
  }

  scrollToView() {
    this.el.scrollIntoView({ behavior: 'smooth' })
  }
}

class ExamPage extends FullRenderingModule {
  private questions: QuestionData[] = []

  constructor() {
    super('exam-page')
    this.fetchData()
  }

  private async fetchData() {
    this.questions = await fetch('/api/questions').then(r => r.json())
    this.render()
  }

  protected buildContent(): void {
    this.addChild(
      new AnswerCard({
        list: this.questions,
        onSelect: index => this.handleSelect(index)
      })
    )
    this.questions.forEach((q, i) =>
      this.addChild(new QuestionItem({ data: q, index: i }))
    )
  }

  private handleSelect(index: number) {
    this.find<QuestionItem>(
      m => m instanceof QuestionItem && m.index === index
    ).forEach(m => m.scrollToView())
  }
}
```

## 全量重渲染的替代方案

如果状态变化不需要保留子模块状态（比如没有输入框），全量重渲染比模块通讯更简单。父模块保持数据，任意子模块回调触发后更新数据并 `render()` 即可，无需持有引用或 `find`。
