# wok-ui

wok-ui 是一个前端 UI 组件库，简洁易用，响应式设计，无第三方依赖，基于 Typescript 有完整的类型约束。

[查看在线演示。](https://peaktai.github.io/wok-ui/)

[查看完整文档。](https://gitee.com/tai/wok-ui/blob/master/documentation/zh-cn/index.md)

## 优缺点

优点：

- 学习成本低，接近于裸 dom
- 强类型推断，开发更效率，尽可能在编译期发现错误
- 体积小，但是功能还算丰富，无第三方依赖
- 由于无动态代理和虚拟层，坑比较少，性能还可以

缺点：

- 不支持数据同步视图，自动化程度低，需要手动调用方法确定要渲染的时机
- 无 dom 差异化渲染，全量渲染有时效果不是很理想，想要好的效果需要细致处理
- 可能会有很深的嵌套，较深的代码层级，较深的 dom 层级
- 与其它 UI 框架混用可能会冲突，为了简化，css 类名都是语义化的，嫌加前缀太繁琐了

## 理念

- 不承诺不负责，没有太多的精力投入到这个项目，无法保证后续的更新
- 不追求大而全，保持克制，只实现必要的基础功能，保持简单
- 面向对象，易于理解，方便封装和抽象，同时也很灵活
- 模块化，利于复杂业务拆分，职责单一，保持专注
- 不兼容老旧浏览器，不在无意义的事情上浪费时间

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

更多的使用方法，请[查看文档](https://gitee.com/tai/wok-ui/blob/master/documentation/zh-cn/index.md)。
