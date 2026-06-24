# 分页器组件

## 效果说明

分页器（Pagination）用于数据列表的分页导航，展示总条数、页码按钮、上一页/下一页翻页。支持页码省略（中间页过多时用 `...` 省略），总条数和每页条数驱动所有计算。

## 实现要点

- 继承 `FullRenderingModule`，页码切换时通过 `render()` 刷新
- 所有页码通过 `calcPageNumbers()` 统一计算，返回一个包含页码、省略号、翻页箭头的数组
- 页码按钮逻辑与渲染分离，计算逻辑清晰可测
- 总条数始终显示，只有一页时不显示页码按钮

## 完整代码

style.less

```less
.pagination {
  display: inline-flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;

  .page-total {
    color: #595959;
    font-size: 14px;
    margin-right: 8px;
  }

  .page-item {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #fff;
    border: 1px solid #e8e8e8;
    color: #595959;
    font-weight: 500;
    cursor: pointer;
    user-select: none;
    transition: background 0.2s, border-color 0.2s, color 0.2s;

    &:hover,
    &.active {
      background: #1677ff;
      border-color: #1677ff;
      color: #fff;
    }

    &.disabled {
      opacity: 0.4;
      pointer-events: none;
    }
  }
}
```

index.ts

```typescript
import { FullRenderingModule } from 'wok-ui'
import './style.less'

/**
 * 分页器组件
 */
export class Pagination extends FullRenderingModule {
  private pn: number

  constructor(
    private opts: {
      total: number
      pz: number
      pn: number
      onChange: (pn: number, pz: number) => void
    }
  ) {
    super()
    this.el.classList.add('pagination')
    this.pn = opts.pn
    this.render()
  }

  /**
   * 计算要显示的页码列表，包含上一页/下一页箭头和省略号。
   * 始终包含第一页和最后一页，中间显示当前页附近的页码，
   * 间隙用 ... 表示。
   */
  private calcPageNumbers(): (number | '...' | '<' | '>')[] {
    const { total, pz } = this.opts
    const pn = this.pn
    const totalPages = Math.ceil(total / pz)
    const maxPagesToShow = 5
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2)
    const startPage = Math.max(1, pn - halfMaxPagesToShow)
    const endPage = Math.min(totalPages, pn + halfMaxPagesToShow)
    const pageNumbers: (number | '...' | '<' | '>')[] = []

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    // 前面有间隙，补省略号和第一页
    if (startPage > 1) {
      pageNumbers.unshift('...')
      pageNumbers.unshift(1)
    }

    // 后面有间隙，补省略号和最后一页
    if (endPage < totalPages) {
      pageNumbers.push('...')
      pageNumbers.push(totalPages)
    }

    // 非第一页时显示上一页箭头
    if (pn > 1) {
      pageNumbers.unshift('<')
    }
    // 非最后一页时显示下一页箭头
    if (pn < totalPages) {
      pageNumbers.push('>')
    }

    return pageNumbers
  }

  protected buildContent(): void {
    const { total, pz } = this.opts
    const totalPages = Math.ceil(total / pz)

    // 总数始终显示
    this.addChild({
      classNames: 'page-total',
      children: `共 ${total} 条`
    })

    // 只有一页，不显示翻页按钮
    if (totalPages <= 1) {
      return
    }

    // 渲染页码按钮
    const pageNumbers = this.calcPageNumbers()
    for (const page of pageNumbers) {
      this.addChild({
        classNames: 'page-item',
        children: (page as string).toString(),
        preHandle: el => {
          if (page === this.pn) {
            el.classList.add('active')
          }
          if (page === '...') {
            el.classList.add('disabled')
          }
        },
        onClick: () => {
          if (page === '...') return

          if (page === '<') {
            this.pn = this.pn - 1
            if (this.pn < 1) return
          } else if (page === '>') {
            this.pn = this.pn + 1
          } else {
            this.pn = page
          }

          this.render()
          this.opts.onChange(this.pn, this.opts.pz)
        }
      })
    }
  }
}
```

## 使用示例

```ts
import { Pagination } from './pagination'

// 基础用法：共 100 条数据，每页 10 条，当前第 1 页
new Pagination({
  total: 100,
  pz: 10,
  pn: 1,
  onChange: (pn, pz) => {
    fetchList({ page: pn, pageSize: pz })
  }
})

// 总条数少，不会出现省略号（共 20 条，每页 10 条，只有 2 页）
new Pagination({
  total: 20,
  pz: 10,
  pn: 1,
  onChange: (pn, pz) => {}
})

// 总条数多，中间页码折叠为省略号
new Pagination({
  total: 500,
  pz: 10,
  pn: 25,
  onChange: (pn, pz) => {}
})
```
