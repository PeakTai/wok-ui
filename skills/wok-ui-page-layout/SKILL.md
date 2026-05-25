---
name: wok-ui-page-layout
description: 介绍 wok-ui 项目，多个页面怎么共用一套统一的页面布局。
license: MIT
metadata:
  author: Peak Tai
  email: peaktai@qq.com
---

# 页面布局

页面的布局复用，一般有两种方式：继承和组合。

## 继承

布局基类是一个抽象类，需要子类实现抽象方法，构建内容。

```typescript
import { FullRenderingModule, showLoading, SubModulesOpt, showWarning, hideLoading } from 'wok-ui'

export abstract class Layout extends FullRenderingModule {
  protected buildContent(): void {
    this.addChild(
      {
        classNames: 'header',
        children: [
          //...header children
        ]
      },
      {
        classNames: 'main',
        children: this.buildMainContent()
      },
      {
        classNames: 'footer',
        children: [
          //...footer children
        ]
      }
    )
  }

  /**
   * 构建主内容，需要子类实现
   */
  abstract buildMainContent(): SubModulesOpt

  // 复杂点的项目，可能还需要构建侧栏等其他内容
  // abstract buildSidebar(): SubModulesOpt
}
```

页面继承 Layout 类，实现 buildMainContent 方法，构建页面内容。

```typescript
export class DemoPage extends Layout {
  constructor() {
    super()
    // 获取数据后渲染页面
    this.fetchData()
  }

  private fetchData() {
    showLoading()
    fetch('/api/data')
      .then(res => res.json())
      .catch(showWarning)
      .finally(() => {
        hideLoading()
        // 渲染页面
        this.render()
      })
  }

  buildMainContent(): SubModulesOpt {
    return add => {
      // TODO: 构建页面内容
    }
  }
}
```

路由配置：

```typescript
initRouter({
  mode: 'hash',
  rules: [
    '/demo':()=>new DemoPage()
  ]})
```

## 组合

组合的模式，实例化布局类，通过构造器传入页面内容。

```typescript
export class Layout extends FullRenderingModule {
  constructor(opts: {
    // 自定义头部内容
    header?: () => SubModulesOpt
    // 内容
    content: () => SubModulesOpt
    // 自定义底部内容
    footer?: () => SubModulesOpt
  }) {
    super()
    this.render()
  }

  protected buildContent(): void {
    // 实现细节省略
  }
}
```

页面文件最终导出一个函数，返回一个 Layout 实例。

```typescript
class DemoPage extends FullRenderingModule {
  protected buildContent(): void {
    // 页面内容省略
  }
}

export function demoPage() {
  return new Layout({
    content: () => new DemoPage()
  })
}
```

路由配置：

```typescript
initRouter({
  mode: 'hash',
  rules: [
    // 直接将函数作为模块工厂函数
    '/demo':demoPage
  ]})
```

## 如何选择布局方式

对于较为复杂的项目，建议使用继承方式。主要原因是继承的方式方便数据共享，
如果页面需要构建多个部分的内容，那么这些构建方法同属一个实例，可以共享数据。

比如下面的组合方式：

```typescript
export function demoPage() {
  return new Layout({
    // content 和 sidebar 来自两个不同模块，但是一般情况下它们的数据应该是共享的
    // 并且这两个部分是需要同时一起渲染的
    // 此时组合的方式就不太方便了，组合的方式更适合耦合度低的场景
    content: () => new DemoPage(),
    sidebar: () => new DemoSidebar()
  })
}
```

组合方式有较好的灵活度，比如支持头部自定义，将常用的头部優成单独模块，页面根据需要组合头部。
如果组合的可能性比较多，继承方式会比较麻烦，可能需要定义多个不同的基类，还会有很复杂的继承关系。