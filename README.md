[English](./README_EN.md)

# wok-ui

wok-ui 是一个前端 UI 组件库，具备以下特点：简单、直观、低心智负担；响应式设计；无第三方依赖；基于 Typescript，有完整的类型约束。

[查看在线演示。](https://peaktai.github.io/wok-ui/)

[查看完整文档。](https://gitee.com/tai/wok-ui/blob/master/documentation/zh-cn/index.md)

## 快速使用

正常使用 npm 安装

```
npm i wok-ui --save
```

在国内有时候会因为网络问题无法使用 npm 来安装，经常出现 ETIMEDOUT 错误，
也因为这个问题新版本可能无法及时发布到 npm 官方仓库。
若急需使用新版本，可以使用 git 仓库来安装。

```
npm install git+https://gitee.com/tai/wok-ui.git --save
```

入口文件 src/main.ts 代码示例

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

### 路由

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

### AI 技能安装

wok-ui 提供了 AI 技能，安装后可以让 AI 编程助手更好地理解和使用 wok-ui 组件。


```bash
npx skills add peaktai/wok-ui --all
```

国内用户访问 github 速度慢，可以使用 gitee 仓库地址来安装。

```bash
npx skills add https://gitee.com/tai/wok-ui.git --all
```

更多的使用方法，请[查看文档](https://gitee.com/tai/wok-ui/blob/master/documentation/zh-cn/index.md)。

## 为什么选择 wok-ui

### 学习成本低，接近原生 DOM

你只需要掌握基础的 TypeScript 和 DOM 知识即可上手。没有虚拟 DOM、没有响应式系统、没有 JSX 编译、没有生命周期钩子，概念极少。如果你会写原生 JavaScript 操作 DOM，只需要很少的学习就能使用 wok-ui。

### 写代码像搭积木

模块即类，DOM 结构用对象字面量描述。你写的代码就是最终执行的逻辑，没有隐藏的编译步骤，没有需要理解的抽象概念。新人能看懂，老手写得快。

```ts
this.addChild({
  classNames: 'card',
  children: [
    { tag: 'h3', innerText: '标题' },
    16, // 间隙
    { tag: 'p', innerText: '内容' }
  ]
})
```

### 类型安全贯穿始终

基于 TypeScript，从组件参数到事件回调都有完整的类型约束。IDE 提示即文档，编译期就能发现大部分错误，不需要额外的类型定义文件。

### 无依赖，轻量可控

零第三方依赖，打包体积小。没有虚拟 DOM、没有响应式代理，行为完全可预测。出了问题看源码就能定位，不需要深入框架黑盒。

### 内置常用功能，开箱即用

表单、表格、弹窗、路由、动画、国际化等基础能力已内置。不需要再选型配套生态，减少决策成本，风格统一，API 设计一致。

### AI 编程友好

概念少、规则明确，AI 生成代码质量更稳定。代码紧凑，同样功能消耗更少 token。错误直观，修复不需要理解框架内部机制。
