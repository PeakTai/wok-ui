---
name: getting-started
description: 介绍 wok-ui 的入门指南，包括项目创建、手动安装、最简使用、使用路由等。
license: MIT
metadata:
  author: Peak Tai
  email: peaktai@qq.com
---

# 入门指南

wok-ui 是一个前端 UI 组件库，具备以下特点：简单、直观、低心智负担；响应式设计；无第三方依赖；深度拥抱 Typescript，提供完善的类型推导与严格的类型约束。

## 创建项目

通过脚手架命令快速创建一个 wok-ui 项目，基于 Vite + TypeScript，开箱即用：

```bash
npm create wok-ui
```

执行命令并完成交互输入，即可生成一个完整的项目。详细的目录结构说明见 [项目结构](references/project-structure.md)。

## 手动安装

如果已有项目，可以直接安装 wok-ui：

```
npm i wok-ui --save
```

## 最简使用

```ts
import 'wok-ui/dist/style.css'
import { DivModule, Text } from 'wok-ui'

// 页面模块，可以继承 Module 或 DivModule 来构建一个新的模块
class Page extends DivModule {
  constructor() {
    super()
    this.addChild(new Text('Hello world !'))
  }
}
// 创建页面模块的实例，然后挂载到 body 上
new Page().mount(document.body)
```

## 使用路由

如果要使用路由，可以使用 initRouter 函数，函数返回一个 Router 实例，也是一个模块，可以直接挂载到 body 上。

```ts
import 'wok-ui/dist/style.css'
import { DivModule, Text } from 'wok-ui'
// 首页模块，对于复杂度高的项目，页面需要分拆到不同的文件中
class HomePage extends DivModule {
  constructor() {
    super()
    this.addChild(new Text('Hello world !'))
  }
}

initRouter({
  mode: 'hash',
  rules: [{ path: '/', module: () => new HomePage() }]
}).mount(document.body)
```
