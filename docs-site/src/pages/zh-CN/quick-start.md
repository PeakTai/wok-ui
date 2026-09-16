---
title: 快速开始
order: 5
icon: fa-rocket
description: 快速上手 wok-ui：安装、最简使用、路由与 AI 技能安装。
---

# 快速开始

## 安装

正常使用 npm 安装。

```bash
npm i wok-ui --save
```

在国内有时候会因为网络问题无法使用 npm 来安装，经常出现 ETIMEDOUT 错误，也因为这个问题新版本可能无法及时发布到 npm 官方仓库。
若急需使用新版本，可以使用 git 仓库来安装。

```bash
npm install git+https://gitee.com/tai/wok-ui.git --save
```

## 最简使用

入口文件 src/main.ts 代码示例。

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
import { initRouter, DivModule, Text } from 'wok-ui'

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

## AI 技能安装

wok-ui 提供了 AI 技能，安装后可以让 AI 编程助手更好地理解和使用 wok-ui 组件。

```bash
npx skills add peaktai/wok-ui --all
```

国内用户访问 github 速度慢，可以使用 gitee 仓库地址来安装。

```bash
npx skills add https://gitee.com/tai/wok-ui.git --all
```
