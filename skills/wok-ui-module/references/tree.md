# 树组件

## 效果说明

树组件（Tree）用于展示具有层级结构的数据，支持展开/折叠、单选/多选节点，以及通过 `buildActions` 钩子为节点添加操作按钮。

本示例是一个**简化版**实现，去掉了拖拽移动、右键菜单等复杂功能，聚焦于树的核心模式——递归渲染、折叠展开和节点选中，让 AI 和开发者都能快速理解如何在 wok-ui 中构建递归结构模块。

### 设计模式

树的核心是**递归**：每个 `TreeNode` 模块在渲染自身的同时，遍历子数据递归创建子 `TreeNode`。在 wok-ui 中，这通过 `addChild` 在 `buildContent` 中循环添加子模块实现。

### 关于 `buildActions` 钩子

`buildActions` 是本示例保留的重要扩展点。它的作用是让业务方给节点注入操作按钮（如编辑、删除、添加子节点等）。示例中将其渲染为节点右侧悬浮显示的文本按钮，但**这只是一个简单实现**。在实际项目中，可将其改为弹出菜单、下拉框或模态框等，替换渲染方式即可，不影响整体树结构。

## 实现要点

- `Tree` 继承 `FullRenderingModule`，数据变化或选中变化时整体 `render()` 重建
- `TreeNode` 继承 `Module`（非 `FullRenderingModule`），构造时一次性构建完成，不单独 re-render
- 折叠/展开通过 CSS class 切换实现，子节点用 `display: none` 控制显隐
- 选中状态通过共享的 `selectedIds` 数组管理，选中变化时 Tree 整体重建
- `buildActions` 渲染为悬浮显示的操作按钮，点击直接触发回调

## 完整代码

style.less

```less
.tree {
  font-size: 14px;
  user-select: none;
  list-style: none;
  padding: 0;
  margin: 0;

  // 树节点
  .tree-node {
    // 节点信息栏
    .node-info {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 8px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s;

      &:hover {
        background: #f5f5f5;

        .node-actions {
          visibility: visible;
        }
      }
    }

    // 折叠图标
    .fold-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      font-size: 10px;
      color: #8c8c8c;
      cursor: pointer;
      flex-shrink: 0;
      transition: transform 0.2s;
    }

    // 标题
    .node-title {
      flex: 1;
      color: #262626;
      word-break: break-all;
      line-height: 1.5;
    }

    // 操作按钮
    .node-actions {
      visibility: hidden;
      display: flex;
      gap: 4px;
      flex-shrink: 0;

      .node-action {
        padding: 2px 8px;
        font-size: 12px;
        color: #1677ff;
        cursor: pointer;
        border-radius: 4px;
        background: transparent;
        border: none;

        &:hover {
          background: #e6f4ff;
        }
      }
    }

    // 子节点容器
    .sub-nodes {
      padding-left: 24px;
      list-style: none;
      margin: 0;
    }

    // 折叠状态
    &.folded > .node-info {
      .fold-icon {
        transform: rotate(-90deg);
      }
    }

    &.folded > .sub-nodes {
      display: none;
    }

    // 选中状态
    &.selected > .node-info {
      background: #e6f4ff;
      color: #1677ff;

      .node-title {
        color: #1677ff;
        font-weight: 500;
      }
    }

    // 禁用状态
    &.disabled > .node-info {
      color: #d9d9d9;
      cursor: not-allowed;

      .node-title {
        color: #d9d9d9;
      }
    }
  }
}
```

index.ts

```typescript
import { FullRenderingModule, Module } from 'wok-ui'
import './style.less'

/**
 * 树节点数据
 */
export interface TreeNodeData {
  id: string
  title: string
  children?: TreeNodeData[]
  /**
   * 是否展开，默认折叠
   */
  unfolded?: boolean
  /**
   * 禁用选中
   */
  disabled?: boolean
}

/**
 * 节点操作按钮
 */
export interface TreeAction {
  label: string
  onClick: () => void
}

// ---- 内部节点模块 ----

class TreeNode extends Module {
  readonly data: TreeNodeData
  readonly level: number
  private foldIconEl?: HTMLElement

  constructor(
    data: TreeNodeData,
    level: number,
    private selectedIds: string[],
    private callbacks: {
      onSelect: (id: string) => boolean
      onFoldChange: () => void
      buildActions?: (data: TreeNodeData, level: number) => TreeAction[]
    }
  ) {
    super(document.createElement('li'))
    this.el.classList.add('tree-node')
    this.data = data
    this.level = level

    // 初始折叠状态
    if (!data.unfolded) {
      this.el.classList.add('folded')
    }
    // 初始选中状态
    if (selectedIds.includes(data.id) && !data.disabled) {
      this.el.classList.add('selected')
    }
    // 禁用状态
    if (data.disabled) {
      this.el.classList.add('disabled')
    }

    // 构建节点内容
    this.buildContent()
  }

  private buildContent() {
    // ---- 信息栏 ----
    this.addChild({
      classNames: 'node-info',
      children: add => {
        // 折叠图标（有子节点才显示）
        if (this.data.children && this.data.children.length > 0) {
          add({
            classNames: 'fold-icon',
            innerText: '▼',
            preHandle: el => {
              this.foldIconEl = el as HTMLElement
            },
            onClick: (e: MouseEvent) => {
              e.stopPropagation()
              this.toggleFold()
            }
          })
        }
        // 标题
        add({ classNames: 'node-title', innerText: this.data.title })
        // 操作按钮
        const actions = this.callbacks.buildActions?.(this.data, this.level)
        if (actions && actions.length > 0) {
          add({
            classNames: 'node-actions',
            children: actions.map(action => ({
              classNames: 'node-action',
              innerText: action.label,
              onClick: (e: MouseEvent) => {
                e.stopPropagation()
                action.onClick()
              }
            }))
          })
        }
      },
      // 点击节点切换选中
      onClick: () => {
        if (this.data.disabled) return
        this.callbacks.onSelect(this.data.id)
      }
    })

    // ---- 子节点 ----
    if (this.data.children && this.data.children.length > 0) {
      this.addChild({
        tag: 'ul',
        classNames: 'sub-nodes',
        children: this.data.children.map(
          child =>
            new TreeNode(child, this.level + 1, this.selectedIds, this.callbacks)
        )
      })
    }
  }

  private toggleFold() {
    this.data.unfolded = !this.data.unfolded
    // 切换 CSS class 来控制显示/隐藏
    this.el.classList.toggle('folded')
    // 更新折叠图标（可选，CSS transform 已处理，但为了兼容性保留）
    if (this.foldIconEl) {
      this.foldIconEl.textContent = this.data.unfolded ? '▼' : '▼'
    }
    this.callbacks.onFoldChange()
  }
}

// ---- 主树模块 ----

/**
 * 树组件
 *
 * 支持展开/折叠、单选/多选、节点操作按钮。
 * 选中或数据变化时整体 re-render。
 */
export class Tree extends FullRenderingModule {
  private data: TreeNodeData[]
  private selectedIds: string[] = []

  constructor(
    private opts: {
      /**
       * 树数据
       */
      data: TreeNodeData[]
      /**
       * 最大选中数量。1 为单选，大于 1 为多选，默认 1
       */
      maxSelected?: number
      /**
       * 默认已选节点 id 列表
       */
      selectedIds?: string[]
      /**
       * 选中变化回调
       * @param nodes 选中的节点数据，附带 level 信息
       */
      onSelectChange?: (nodes: Array<TreeNodeData & { level: number }>) => void
      /**
       * 数据变化回调（折叠状态变化等）
       * @param data 最新数据
       */
      onChange?: (data: TreeNodeData[]) => void
      /**
       * 构造节点的操作按钮。返回的按钮会渲染在节点右侧。
       * 如需弹出菜单，在 onClick 中自行调用弹窗/下拉模块即可。
       */
      buildActions?: (data: TreeNodeData, level: number) => TreeAction[]
    }
  ) {
    super(document.createElement('ul'))
    this.el.classList.add('tree')
    this.data = [...opts.data]
    this.selectedIds = opts.selectedIds ? [...opts.selectedIds] : []
    this.render()
  }

  protected buildContent(): void {
    for (const item of this.data) {
      this.addChild(
        new TreeNode(item, 1, this.selectedIds, {
          onSelect: id => this.handleSelect(id),
          onFoldChange: () => this.handleFoldChange(),
          buildActions: this.opts.buildActions
        })
      )
    }
  }

  private handleSelect(id: string): boolean {
    // 检查是否 disabled（实际在 TreeNode 中已禁止点击，这里双重保障）
    const node = this.findNodeData(id)
    if (!node || node.disabled) return false

    const maxSelected = this.opts.maxSelected ?? 1
    const idx = this.selectedIds.indexOf(id)
    const isSelected = idx !== -1

    if (maxSelected === 1) {
      // 单选：点击已选中则取消，否则替换
      if (isSelected) {
        this.selectedIds.splice(0, this.selectedIds.length)
      } else {
        this.selectedIds.splice(0, this.selectedIds.length)
        this.selectedIds.push(id)
      }
    } else {
      // 多选
      if (isSelected) {
        this.selectedIds.splice(idx, 1)
      } else if (this.selectedIds.length >= maxSelected) {
        return false
      } else {
        this.selectedIds.push(id)
      }
    }

    // 重建树
    this.render()
    this.triggerSelectChange()
    return true
  }

  private handleFoldChange() {
    this.opts.onChange?.(this.data)
  }

  private triggerSelectChange() {
    if (!this.opts.onSelectChange) return
    const nodes = this.find<TreeNode>(m => m instanceof TreeNode)
      .filter(n => this.selectedIds.includes(n.data.id))
      .map(n => ({ ...n.data, level: n.level }))
    this.opts.onSelectChange(nodes)
  }

  private findNodeData(id: string): TreeNodeData | undefined {
    function search(list: TreeNodeData[]): TreeNodeData | undefined {
      for (const item of list) {
        if (item.id === id) return item
        if (item.children) {
          const found = search(item.children)
          if (found) return found
        }
      }
      return undefined
    }
    return search(this.data)
  }

  // ---- 公开方法 ----

  /** 获取节点数据 */
  getNode(id: string): (TreeNodeData & { level?: number }) | undefined {
    const nodeModule = this.findFirst<TreeNode>(m => m instanceof TreeNode && m.data.id === id)
    return nodeModule ? { ...nodeModule.data, level: nodeModule.level } : undefined
  }

  /** 获取选中节点 */
  getSelectedNodes(): Array<TreeNodeData & { level: number }> {
    return this.find<TreeNode>(m => m instanceof TreeNode)
      .filter(n => this.selectedIds.includes(n.data.id))
      .map(n => ({ ...n.data, level: n.level }))
  }

  /** 添加节点 */
  addNode(data: TreeNodeData, parentId?: string) {
    if (!parentId) {
      this.data.push(data)
    } else {
      const parent = this.findNodeData(parentId)
      if (!parent) return
      if (!parent.children) parent.children = []
      parent.children.push(data)
    }
    this.render()
    this.opts.onChange?.(this.data)
  }

  /** 删除节点 */
  deleteNode(id: string) {
    function remove(list: TreeNodeData[], targetId: string): boolean {
      const idx = list.findIndex(item => item.id === targetId)
      if (idx !== -1) {
        list.splice(idx, 1)
        return true
      }
      for (const item of list) {
        if (item.children && remove(item.children, targetId)) return true
      }
      return false
    }
    remove(this.data, id)
    // 清理已选
    const selIdx = this.selectedIds.indexOf(id)
    if (selIdx !== -1) this.selectedIds.splice(selIdx, 1)
    this.render()
    this.triggerSelectChange()
    this.opts.onChange?.(this.data)
  }
}
```

## 使用示例

```ts
import { Tree } from './tree'

// ---- 基础用法：单选 + 折叠 ----
new Tree({
  data: [
    {
      id: '1',
      title: '研发部',
      unfolded: true,
      children: [
        { id: '1-1', title: '前端组' },
        { id: '1-2', title: '后端组' },
        { id: '1-3', title: '测试组' }
      ]
    },
    {
      id: '2',
      title: '市场部',
      children: [
        { id: '2-1', title: '品牌组' },
        { id: '2-2', title: '渠道组' }
      ]
    }
  ],
  onSelectChange: selected => {
    console.log('选中节点：', selected)
  }
})

// ---- 多选 + 操作按钮 ----
new Tree({
  maxSelected: 3,
  data: [
    {
      id: '10',
      title: '目录结构',
      unfolded: true,
      children: [
        { id: '10-1', title: 'src' },
        { id: '10-2', title: 'dist' }
      ]
    }
  ],
  buildActions: (data, level) => [
    {
      label: '编辑',
      onClick: () => {
        // 弹出编辑对话框（由业务方实现）
        editNodeName(data)
      }
    },
    {
      label: '添加子节点',
      onClick: () => {
        // 添加子节点（由业务方实现）
        addChildNode(data)
      }
    },
    {
      label: '删除',
      onClick: () => {
        // 弹出确认框（由业务方实现）
        confirmDelete(data)
      }
    }
  ],
  onSelectChange: selected => {
    console.log('选中的节点：', selected.map(n => n.title))
  }
})
```
