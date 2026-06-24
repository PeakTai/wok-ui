# 描述列表模块

## 效果说明

描述列表（Description List）用于展示一组键值对数据，常见于详情页、信息卡片等场景。基于 CSS Grid 实现多列布局，支持自定义列数和间距，以及独占一行的条目。

## 实现要点

- 继承 `DivModule`，通过 CSS Grid 实现多列等宽布局
- `--dl-cols` 和 `--dl-gap` 是模块动态设置的 CSS 变量，控制列数和间距
- 每个条目默认占一列，通过 `exclusiveRow` 可让其独占整行
- 标签和内容垂直排列，标签在上、内容在下

## 完整代码

style.less

```less
.description-list {
  display: grid;
  grid-template-columns: repeat(var(--dl-cols, 3), 1fr);
  gap: var(--dl-gap, 24px);

  .description-item {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .description-label {
      font-size: 13px;
      font-weight: 500;
      color: #8c8c8c;
      white-space: nowrap;
    }

    .description-content {
      font-size: 14px;
      color: #595959;
      word-break: break-word;
      line-height: 1.5;
    }
  }
}
```

index.ts

```typescript
import { DivModule, SubModulesOpt } from 'wok-ui'
import './style.less'

export interface DescriptionItem {
  label: SubModulesOpt
  content: SubModulesOpt
  /**
   * 条目独占一行
   */
  exclusiveRow?: boolean
}

export class DescriptionList extends DivModule {
  constructor(opts: {
    items: DescriptionItem[] | ((add: (...item: DescriptionItem[]) => void) => void)
    cols?: number
    gap?: number
  }) {
    super('description-list')
    const { items, cols = 3, gap = 24 } = opts

    // 动态设置 CSS 变量，控制网格列数和间距
    this.el.style.setProperty('--dl-cols', cols.toString())
    this.el.style.setProperty('--dl-gap', `${gap}px`)

    // 构建 items
    const finalItems: DescriptionItem[] = []
    if (Array.isArray(items)) {
      finalItems.push(...items)
    } else {
      function add(...items: DescriptionItem[]) {
        finalItems.push(...items)
      }
      items(add)
    }

    for (const item of finalItems) {
      this.addChild({
        classNames: 'description-item',
        style: item.exclusiveRow ? { gridColumn: `span ${cols}` } : undefined,
        children: [
          {
            classNames: 'description-label',
            children: item.label
          },
          {
            classNames: 'description-content',
            children: item.content
          }
        ]
      })
    }
  }
}
```

## 使用示例

```ts
import { DescriptionList } from './description-list'

// 基础用法：3 列展示用户信息
new DescriptionList({
  items: [
    { label: '姓名', content: '张三' },
    { label: '部门', content: '研发部' },
    { label: '职位', content: '高级工程师' },
    { label: '入职日期', content: '2023-06-01' },
    { label: '工号', content: 'EMP-2023-001' },
    { label: '状态', content: '在职' }
  ]
})

// 自定义列数和间距
new DescriptionList({
  cols: 2,
  gap: 32,
  items: [
    { label: '项目名称', content: '企业微信集成' },
    { label: '项目编号', content: 'PRJ-2024-008' },
    { label: '负责人', content: '李四' },
    { label: '开始时间', content: '2024-01-15' }
  ]
})

// 回调方式动态构建，根据条件决定是否添加某些条目
new DescriptionList({
  cols: 3,
  items: add => {
    add(
      { label: '订单号', content: 'ORD-2024-001' },
      { label: '下单时间', content: '2024-06-20 14:30' },
      { label: '订单状态', content: '待发货' }
    )
    // 根据条件动态添加：有物流信息才显示
    if (trackingInfo) {
      add({ label: '物流公司', content: trackingInfo.company })
      add({ label: '运单号', content: trackingInfo.number })
    }
    // 根据条件动态添加：有备注才显示，且独占一行
    if (orderRemark) {
      add({
        label: '订单备注',
        content: orderRemark,
        exclusiveRow: true
      })
    }
    add(
      { label: '联系人', content: '王五' },
      { label: '联系电话', content: '138****8888' },
      { label: '邮编', content: '518000' }
    )
  }
})
```
