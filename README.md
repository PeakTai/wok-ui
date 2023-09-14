# wok-ui

wok-ui 是一个前端 UI 组件库，简洁易用，响应式设计，无第三方依赖，使用 Typescript 开发有完整的类型约束。

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
- 不兼容老旧浏览器，不在无意义的事情上浪费时间，至少要 es6 版本，支持 class

## 核心概念

组件库最核心的概念是模块，模块的的作用是复用 html 组合。想想看如果每次使用模态框都要写一层级很深很复杂的 html 代码，非常繁琐还容易出错。
模块就是把这些 html 组合封装起来，可以快速复用，避免重写编写相同的 html 组合代码。

模块是面向对象的，每个模块都是一个类，和模块有关的操作都在类的内部，内部的属性保持着模块的状态和信息，只对外暴露必须的属性和方法。
模块的内部仍然是基于 dom 的，但是 dom 不对外暴露，外部不能直接修改一个模块内部的 dom ，尤其是改样式这种操作。

全量渲染，在适当的时候重新构建整个模块的内容。如果想要细腻的进行局部更新，可将需要刷新的地方封装成一个单独的模块。
全量渲染可能会导致页面闪烁或跳动，可以通过固定元素高度尺寸，或使用占位来缓解，还可以将不需要变化的静态内容缓存。

垫片，一个可以设置高度的空白内容模块，用来控制不同模块之间的间隙。模块自身不应该有外边距，通过模块的外边距来控制间隙会影响模块的可复用性，增加复杂度。

## 编码规范

- 所有模块的参数，如果没有特殊情况长度单位都是像素（px），使用 number 类型
- 常用组合封装成模块，禁止大量复用 css 的 class，尤其是到处手写 class 名称
- 禁止在 ts 代码中写大量的内联样式，样式复杂的，单独写 css 文件
- 模块间的上下间隙，使用垫片，不要让模块自带内外边距，不利于复用
- 使用 flex 布局，不要再使用浮动和表格等老技术来实现一些弹性效果

## 快速使用

安装

```
npm i wok-ui --save
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

### 国际化

组件库内置对中英文的支持，如果需要支持其它语言，需要自定义设置。

调用 setI18nMessages 函数来设置新语言的信息.

```ts
setI18nMessages('Tibt', {
  confirm: 'གཏན་འཁེལ་',
  cancel: 'ཕྱིར་འབུད་བྱ་ཡུལ།'
})
```

调用 setLang 函数可以强制切换语言。默认的情况下，调用 navigator.languages 来获取当前系统设置的语言进行匹配，如果匹配不到，则使用默认（英文）。

```ts
setLang('tibt')
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

[更多组件的使用方法见测试示例的源代码。](./test/main.ts)

## css 变量与自定义

在程序中可以使用以下的 css 变量，来保持模块样式的一致性。

| 变量名                 | 含义                                               |
| :--------------------- | :------------------------------------------------- |
| --color-primary        | 主题色                                             |
| --color-danger         | 危险色                                             |
| --color-success        | 成功色                                             |
| --color-warning        | 警告色                                             |
| --color-border         | 边框颜色                                           |
| --color-text           | 普通文本颜色                                       |
| --color-text-secondary | 次级文本颜色                                       |
| --color-outline        | 轮廓描边颜色，元素获取焦点时显示，默认是很淡的蓝色 |
| --size-text            | 默认文本大小                                       |
| --size-text-sm         | 小号文本大小                                       |
| --size-text-lg         | 大号文本大小                                       |
| --size-text-xl         | 特大号文本大小                                     |
| --size-border-radius   | 圆角大小                                           |

通过 setColor 和 setSize 函数可以设置全局的颜色和尺寸，来改变这些变量，实现自定义。
也可以通过 getColor 和 getSize 函数在代码中获取这些值。

## 组件

下面是主要的组件：

| 组件                | 作用                                                                                  |
| :------------------ | :------------------------------------------------------------------------------------ |
| Animation           | 动画，提供一些基础的动画功能，通过 animate 函数来让元素呈现动画                       |
| Color               | 颜色，通过 getColor 函数获取颜色，通过 setColor 自定义颜色                            |
| Size                | 尺寸，通过 getSize 函数获取尺寸信息，通过 setSize 函数自定义各种尺寸                  |
| FullRenderingModule | 全量渲染模块 ，需要全量渲染的模块可继承此模块                                         |
| ResponsiveModule    | 响应式模块 ，在全量渲染的基础上支持了响应式，当尺寸变化达到响应式分隔点临界点重新渲染 |
| Spacer              | 垫片，增加垂直方向的间隔，推荐使用此组件来控制间隙，模块本身不应该有内外边距          |
| HSpacer             | 水平方向的垫片                                                                        |
| Button              | 按钮                                                                                  |
| Text                | 普通文本                                                                              |
| PrimaryBodyText     | 首要正文                                                                              |
| SecondaryBodyText   | 次要正文                                                                              |
| Title               | 标题                                                                                  |
| LargeTitle          | 大号标题                                                                              |
| SvgIcon             | svg 图标                                                                              |
| RemoteSvgIcon       | 远程 svg 图标                                                                         |
| Link                | 链接                                                                                  |
| Grid                | 网格                                                                                  |
| HBox                | 横向堆叠元素的盒子容器                                                                |
| VBox                | 纵向堆叠元素的盒子容器                                                                |
| JustifyBox          | 将元素两端对齐的盒子容器                                                              |
| HSplitBox           | 横向分隔空间的盒子容器                                                                |
| Dropdown            | 下拉花间                                                                              |
| Drawer              | 抽屉，贴边的弹出对话框                                                                |
| Modal               | 模态对话框                                                                            |
| Table               | 表格                                                                                  |
| Form                | 表单                                                                                  |
| TextInput           | 普通文本输入框                                                                        |
| NumberInput         | 数字输入框                                                                            |
| DateInput           | 日期输入框                                                                            |
| TextArea            | 多行文本框                                                                            |
| CheckboxGroup       | 多选勾选框组                                                                          |
| BoolCheckbox        | 绑定布尔值的勾选框                                                                    |
| RadioGroup          | 单选勾选框组                                                                          |
| Select              | 下拉选择框                                                                            |
| Range               | 滑动条                                                                                |
| Router              | 路由                                                                                  |
| RouterLink          | 路由链接                                                                              |

## 你可能想知道的一些问题

### 为什么所有组件长度参数的单位都是 px

这样做是因为 dom 相关 api 返回的结果单位都是像素，统一使用像素可以保持一致，方便整合。
对于国内的大多数开发团队，UI 设计都是以像素为单位的，甚至还要像素级别核对验收，以像素为单位就比较的方便了。

如果需要以 rem 为单位，可通过 rem 函数来转换。

```ts
rem(0.5) // 0.5rem
new Spacer(rem(1)) // 高度为 1rem 的垫片
```

### 组件太少了

是的。这个项目我只放上我认为必要的组件，不做大而全，如果以后有精力可以搞个单独的扩展库。

### 为什么异常信息和注释都是中文？

使用母语效率高，全英文太累了，精力有限。已经做过一次调整，绝大部分异常信息应该都使用了英文。
至于注释，暂时先不动，除非需要与英语母语者协作。

### 文档不完善

是的，后面会考虑完善一下，或许还可以加个英文版本。目前想了解组件的详细使用示例，可以查看源码 test 目录下的测试代码。
每个模块的各个参数都有详细的注释说明，使用的时候可留意下，原本的想法就是把文档全写在注释里，
开发人员不需要面向文档编程，在编辑器里就可以查看到自己需要的信息。
