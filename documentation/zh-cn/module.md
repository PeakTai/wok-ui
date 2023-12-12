# 模块

模块就是一个复用单元，是对一到多个 dom 元素的封装，其作用是快速复用常用的 dom 组合，比如表格。
想想看如果每次使用模态框都要写一层级很深很复杂的 html 代码，非常繁琐还容易出错。
模块就是把这些 html 组合封装起来，可以快速复用，避免重写编写相同的 html 组合代码。

模块是面向对象的，每个模块都是一个类，和模块有关的操作都在类的内部，内部的属性保持着模块的状态和信息，
只对外暴露必须的属性和方法。模块的内部仍然是基于 dom 的，但是 dom 不对外暴露，
外部不能直接修改一个模块内部的 dom ，尤其是改样式这种操作。

## Module

Module 是模块基类（抽象类，不能直接使用），可通过继承 Module 来实现一个自定义模块。Module 构造器要求接收一个 HTMLElement 类型的参数。

```ts
class CustomModule extends Module {
  constructor() {
    super(document.createElement('div'))
  }
}
```

Module 对子类暴露 el 属性，也即是构建时传入的 HTMLElement 实例，子类可以做一些自定义的 dom 操作。

```ts
class CustomModule extends Module {
  constructor() {
    super(document.createElement('div'))
    this.el.classList.add('custom')
  }
}
```

Module 内部提供了一些方法用于构建内容，只对子类开放，下面列举几个常用方法。

| 方法        | 作用                       |
| :---------- | :------------------------- |
| addChild    | 添加新的子模块             |
| insertChild | 指定位置插入子模块         |
| moveChild   | 移动子模块                 |
| find        | 查找子模块                 |
| findFirst   | 查找第一个符合条件的子模块 |
| empty       | 清空子模块                 |

一般情况下，只需要使用 addChild 方法。上面的示例再调整下，添加一些文字。

```ts
class CustomModule extends Module {
  constructor() {
    super(document.createElement('div'))
    // 添加一行文本， Text 是组件库自带的一个基础模块，后面会介绍
    this.addChild(new Text('Hello World !'))
  }
}
```

Module 还有一些对外开放的方法，常用的有 mount 和 destroy，分别是挂载和销毁。

通过 mount 方法，将自定义模块挂载到 body 上进行展示。

```ts
new CustomModule().mount(document.body)
```

通过覆写 mount 和 destroy ，可以在模块被挂载和被销毁时做一些额外操作，比如销毁时清理掉一些资源。

```ts
/**
 * 倒计时模块
 */
class CountDownModule extends Module {
  timerId = 0
  count = 100

  mount(parentEl: Element): void {
    this.timerId = setInterval(() => {
      this.count--
      this.el.innerText = this.count + ''
      if (this.count <= 0) {
        clearInterval(this.timerId)
        this.timerId = 0
      }
    }, 1000)
    super.mount(parentEl)
  }

  destroy(): void {
    if (this.timerId) clearInterval(this.timerId)
    super.destroy()
  }
}
```

## DivModule

为了方便，组件库提供了一个模块的实现类 DivModule，仅仅是默认传入 div 元素来构建模块。
DivModule 构造函数接收的是css类名称集合，通过继承 DivModule 可更为方便的构建基于 div 元素的模块。

```ts
class CustomModule extends DivModule {
  constructor() {
    super('container', 'px-5')
  }
}
```

## 可转换为模块的类型

有很多类型都可以转换为模块，在一些可以使用模块作为参数的地方，也可以直接使用这些类型，内部会自动进行转换，
带来了很多便利，能省下少事，减少重复。

| 类型         | 转换后的模块类型                                           |
| :----------- | :--------------------------------------------------------- |
| string       | 文本                                                       |
| number       | 垫片，增加垂直间隙                                         |
| HTMLElement  | 基于元素创建的模块                                         |
| () => Module | 函数执行后返回的模块，适用延迟构建模块的场景，需要时再构建 |

比如前面提示到的 addChild 方法，就是支持这些类型的。

```ts
class CustomModule extends DivModule {
  constructor() {
    super()
    this.addChild(
      '第一段文字',
      16,
      '第二段文字',
      16,
      '第三段文字',
      16,
      document.createElement('hr'),
      16,
      '分隔的第二部分'
    )
  }
}
```

组件库内置的功能基本所有的相关参数都是支持的。如果想让自定义的组件来支持可使用组件库提供的类型 ConvertibleModule
,以及 convertToModule 函数。

```ts
class Layout extends DivModule {
  constructor(content: ConvertibleModule) {
    super()
    this.addChild(convertToModule(content))
    // 实际上 addChild 接收的类型就是 ConvertibleModule ，可直接使用
    this.addChild(content)
  }
}
```

如果是接收一组模块，组件库也提供了 SubModulesOpt 类型，和转换函数 buildSubModules。SubModulesOpt 可以看作是 ConvertibleModule 数组，
但是在此基础上又增加了一些功能，后面还会介绍。

```ts
class List extends DivModule {
  constructor(items: SubModulesOpt) {
    super()
    // 使用 buildSubModules 函数将 SubModulesOpt 转换为模块数组
    this.addChild(...buildSubModules(items))
  }
}

new List(['条目一', '条目二', '条目三'])
```

## createDomModule

假如模块很复杂，包含了很多层级和非常多的元素，内部就需要做很多添加的操作，可以通过 createDomModule
来快速的创建一个匿名模块来构建内容。

```ts
class Modal extends DivModule {
  constructor() {
    super('modal', 'fade')
    this.addChild(
      createDomModule({
        classNames: 'modal-dialog',
        children: [
          createDomModule({
            classNames: 'modal-content',
            children: [
              createDomModule({
                classNames: 'modal-header',
                children: [
                  createDomModule({
                    classNames: 'modal-title',
                    innerText: '模态框标题'
                  })
                ]
              }),
              createDomModule({
                classNames: 'modal-body',
                children: [new Text('body')]
              }),
              createDomModule({
                classNames: 'modal-footer',
                style: { color: 'grey' },
                innerText: 'footer'
              })
            ]
          })
        ]
      })
    )
  }
}
```

上面的示例，通过 createDomModule 的嵌套，构建出了一个模态框的结构。

前面提到 ConvertibleModule 实际上还有一种可以转换为模块的类型，就是 createDomModule 函数的参数，
所以支持 ConvertibleModule 类型参数的地方，都可以省略 createDomModule，转换函数内部会自动调用 createDomModule 来转换。
而 createDomModule 的 children 参数类型是 SubModulesOpt，也是可以省略的。

上面的例子精简一下：

```ts
class Modal extends DivModule {
  constructor() {
    super('modal', 'fade')
    this.addChild({
      classNames: 'modal-dialog',
      children: [
        {
          classNames: 'modal-content',
          children: [
            {
              classNames: 'modal-header',
              children: [
                {
                  classNames: 'modal-title',
                  innerText: '模态框标题'
                }
              ]
            },
            {
              classNames: 'modal-body',
              children: [new Text('body')]
            },
            {
              classNames: 'modal-footer',
              style: { color: 'grey' },
              innerText: 'footer'
            }
          ]
        }
      ]
    })
  }
}
```

如果 children 只有一个元素，也可以直接写元素，不用写数组，这是 SubModulesOpt 类型可以兼容的。

上面的例子还可以再精简下。

```ts
class Modal extends DivModule {
  constructor() {
    super('modal', 'fade')
    this.addChild({
      classNames: 'modal-dialog',
      children: {
        classNames: 'modal-content',
        children: [
          {
            classNames: 'modal-header',
            children: {
              classNames: 'modal-title',
              innerText: '模态框标题'
            }
          },
          {
            classNames: 'modal-body',
            children: new Text('body')
          },
          {
            classNames: 'modal-footer',
            style: { color: 'grey' },
            innerText: 'footer'
          }
        ]
      }
    })
  }
}
```

这样相比第一个版本，代码的层级少了很多，看起来更舒服了。

对于一些需要动态构建的内容， SubModulesOpt 还支持回调添加的方式，其完整定义如下：

```ts
/**
 * 子模块选项，可用于模块的构建参数中.
 * 支持直接使用可转换的模块和动态添加的函数.
 */
export type SubModulesOpt =
  | Exclude<ConvertibleModule, () => Module>
  | ConvertibleModule[]
  | ((addChild: (...child: ConvertibleModule[]) => void) => void)
```

看起来有点复杂，其实用起来还好，下面是一个示例。

```ts
class List extends DivModule {
  constructor(list: Product[]) {
    super('product-list')
    for (const item of list) {
      this.addChild({
        classNames: 'item',
        // 通过回调的形式添加子模块，可编写逻辑动态进行构建
        children: addChild => {
          // 封面
          if (item.coverUrl) {
            // 封面存在时才添加下面的元素
            addChild(
              {
                tag: 'img',
                className: 'cover',
                attrs: { src: item.coverUrl }
              },
              16
            )
          }
          // 标题
          addChild(item.name)
        },
        onClick(ev) {
          // TODO 去商品详情页
        }
      })
    }
  }
}
```
