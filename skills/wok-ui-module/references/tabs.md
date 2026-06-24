# 标签页组件

## 效果说明

标签页（Tabs）用于在多个视图之间切换，一次只显示一个内容面板。顶部是标签头，点击切换下方对应的内容区。

本示例展示：
- `FullRenderingModule` + `cacheModule` 组合，切换 tab 时内容面板状态不丢失
- 标签头和内容面板在一个模块内统一管理
- 支持禁用某些标签项

## 实现要点

- 继承 `FullRenderingModule`，点击标签时调用 `render()` 整体刷新
- 内容面板通过 `cacheModule` 缓存，切换回来时保留原有状态和 DOM
- 标签头采用 `display: flex` 水平排列，激活项通过 `.active` 类名标记

## 完整代码

style.less

```less
.tabs {
  .tabs-header {
    display: flex;
    gap: 0;
    border-bottom: 2px solid #e8e8e8;

    .tabs-item {
      padding: 10px 24px;
      font-size: 14px;
      font-weight: 500;
      color: #8c8c8c;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      user-select: none;
      transition: color 0.2s, border-color 0.2s;

      &:hover {
        color: #1677ff;
      }

      &.active {
        color: #1677ff;
        border-bottom-color: #1677ff;
        pointer-events: none;
      }

      &.disabled {
        color: #d9d9d9;
        cursor: not-allowed;
        pointer-events: none;
      }
    }
  }

  .tabs-content {
    padding: 16px 0;
  }
}
```

index.ts

```typescript
import { ConvertibleModule, FullRenderingModule, convertToModule } from 'wok-ui'
import './style.less'

export interface TabItem {
  title: string
  content: ConvertibleModule
  disabled?: boolean
}

/**
 * 标签页组件
 *
 * 点击标签头切换内容面板，通过 cacheModule 缓存内容，
 * 切换回已访问过的 tab 时保留其状态。
 */
export class Tabs extends FullRenderingModule {
  private activeIndex = 0

  constructor(
    private readonly opts: {
      items: TabItem[]
      activeIndex?: number
      onChange?: (index: number) => void
    }
  ) {
    super('tabs')
    this.activeIndex = opts.activeIndex ?? 0
    this.render()
  }

  protected buildContent(): void {
    // 标签头
    this.addChild({
      classNames: 'tabs-header',
      children: this.opts.items.map((item, index) => ({
        classNames: [
          'tabs-item',
          index === this.activeIndex ? 'active' : '',
          item.disabled ? 'disabled' : ''
        ],
        innerText: item.title,
        onClick: () => {
          if (item.disabled || index === this.activeIndex) return
          this.activeIndex = index
          this.render()
          this.opts.onChange?.(index)
        }
      }))
    })

    // 内容面板（缓存，切换回来时保留状态）
    this.addChild({
      classNames: 'tabs-content',
      children: this.cacheModule({
        key: `tab-${this.activeIndex}`,
        module: () => convertToModule(this.opts.items[this.activeIndex].content)
      })
    })
  }

  /** 切换到指定索引的标签 */
  switchTo(index: number) {
    if (index < 0 || index >= this.opts.items.length) return
    if (this.opts.items[index].disabled) return
    this.activeIndex = index
    this.render()
    this.opts.onChange?.(index)
  }

  /** 获取当前激活的索引 */
  getActiveIndex(): number {
    return this.activeIndex
  }
}
```

## 使用示例

```ts
import { Tabs } from './tabs'
import { DivModule, Text } from 'wok-ui'

// 基础用法：纯文本内容
new Tabs({
  items: [
    { title: '用户管理', content: '用户管理列表' },
    { title: '角色管理', content: '角色管理列表' },
    { title: '权限设置', content: '权限设置页面' }
  ]
})

// 模块作为内容，支持任意 ConvertibleModule
new Tabs({
  activeIndex: 1, // 默认激活第二个标签
  items: [
    { title: '详情', content: new DetailModule() },
    { title: '编辑', content: new EditModule() },
    { title: '日志', content: new LogModule() }
  ],
  onChange: index => {
    console.log('切换到标签', index)
  }
})

// 禁用某些标签
new Tabs({
  items: [
    { title: '基本信息', content: '基本信息内容' },
    { title: '高级设置', content: '高级设置内容', disabled: true },
    { title: '其他配置', content: '其他配置内容' }
  ]
})
```
