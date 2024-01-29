# 路由

对于一个复杂的单页应用，可以使用路由组件来组织页面，让每个页面对应一个地址，并且可以单独编写。
组件库自带了路由实现，支持路径别名和默认页面，足以应付大多场景。

## 初始化路由

通过函数 initRouter 可以初始化一个路由，返回 Router 类型的实例，Router 类型也是一种模块，
可以在初始化成功后直接挂载到　 body 上。

```ts
initRouter({
  // 模式，支持 hash 和 history 两种
  mode: 'history',
  /**
   * 基础路径，history 模式有效
   */
  base: '/docs/v3',
  // 规则
  rules: [
    // path 路径
    // alias 别名，使用别名路径一样可以访问，主要作用是兼容旧地址
    // module 页面对应的模块，需要是一个函数，返回模块实例
    { path: '/', alias: ['/list'], module: () => new HomePage() },
    // 支持带变量的动态路径
    { path: '/phones/:id', alias: ['/list'], module: () => new PhoneDetail() },
    { path: '*', module: () => new NotFound() }
  ]
  // 直接将路由实例挂载
}).mount(document.body)
```

这样我们就创建了一个路由，为每个页面编写一个单独的模块。

## 按需加载

为了能够让程序加载的速度更快，不必一开始就加载所有模块，而是让页面在需要时加载，可以使用 import 函数。
module 参数是支持返回 `Promise<Module>` 类型的。

button.ts 文件：

```ts
export class Page extends DivModule {
  // 页面逻辑省略...
}
```

```ts
initRouter({
  mode: 'hash',
  rules: [
    { path: '/', alias: ['/list'], module: () => new HomePage() },
    // 让 button 这个页面在需要的时候再加载
    { path: 'button', module: () => import('./button').then(res => new res.Page()) },
    { path: '*', module: () => new NotFound() }
  ]
}).mount(document.body)
```

通过上面的操作 button.ts 这个文件在构建时会单独生成一个文件，在请求 `/button` 这个页面地址时
才去加载这个文件。当然，这一切都需要打包器的支持才可以实现。

## 参数获取

通过 getRouter 函数可以获取路由实例，通过路由实例对象可以获取路径变量和请求参数。

```ts
/**
 * 列表页面
 */
class List extends DivModule {
  constructor() {
    super()
    // 请求地址：/list?keyword=phone&tag=ios&tag=android
    const router = getRouter()
    const keyword = router.getParam('keyword') // 'phone'
    const tags = router.getParamVals('tag') // ['ios','android']
  }
}
```

路径变量获取示例：

```ts
/**
 * 书藉详情页
 */
class BookDetail extends DivModule {
  constructor() {
    super()
    // 路由 path 设置： /books/:id
    // 请求地址：/books/0001
    const router = getRouter()
    const id = router.getPathVar('id') // '0001'
  }
}
```

## 页面跳转

通过路由实例对象的 push 和 replace 方法可以分别以增加记录和替换记录的方式来跳转页面。

```ts
// push 支持直接填写路径，或者指定路径的查询参数
getRouter().push('books')
getRouter().push({ path: 'books', query: { tag: 'coding' } })
// replace 和 push 方法参数类型是一模一样的
// 不同的是 replace 会替换当前页面，后退的时候不会再回到当前页面，相当于将当前页面从访问历史中抹除了
getRouter().replace('books')
getRouter().replace({ path: 'books', query: { tag: 'coding' } })
```

## 布局复用

路由规则是不支持嵌套的，这样会比较混乱，难以维护，每个路由模块间不应该有层级关系。

如果需要布局复用，推荐的方式是将布局封装成为一个模块。

布局 layout.ts 文件：

```ts
export class Layout extends DivModule {
  /**
   * @param content 要嵌入到布局中的内容
   */
  constructor(content: SubModulesOpt) {
    super('layout')
    this.addChild(
      {
        classNames: 'header',
        children: [
          // 省略....
        ]
      },
      {
        classNames: 'body',
        // 内容被嵌入到这里
        children: content
      },
      {
        classNames: 'footer',
        children: [
          // 省略....
        ]
      }
    )
  }
}
```

使用布局的页面 list.ts 代码 :

```ts
import { Layout } from './layout'
/**
 * list 页面
 */
class Page extends DivModule {
  // 省略 ...
}
/**
 * 导出一个构建页面的函数，创建套用布局的页面模块
 */
export function listPage() {
  return new Layout(new Page())
}
```

路由初始化代码：

```ts
import { listPage } from './list.ts'

initRouter({
  mode: 'hash',
  rules: [{ path: '/', alias: ['/list'], module: listPage }]
}).mount(document.body)
```

最后，复用布局不要使用继承的方式，一个页面来继承布局模块会导致很多问题，布局的复用应该使用组合的方式。

## 缓存

如果希望回到一个页面，不再重新请求数据和渲染，保持原来的状态，可以使用缓存。

```ts
initRouter({
  mode: 'hash',
  // 最多缓存页面的数量
  cacheLimit: 10,
  // 在规则这里添加参数 cache，将值设置为 true 即可将页面缓存
  rules: [{ path: '/', alias: ['/list'], module: listPage, cache: true }]
}).mount(document.body)
```

缓存会根据参数来处理的，同一个路由，参数不同则会缓存不同的页面，比如 /list?q=1 和 /list?q=2 是两个页面。缓存实际上是通过保留原页面的对象和 dom 元素来实现的，所以尽可能将上限设置低一些，缓存太多的
页面会导致内存占用过高，页面卡顿甚至崩溃。

## 生命周期

每个页面都是有生命周期的，当路由进入时，页面模块被挂载，路由切换到其它页面时，
当前的页面模块被销毁。如果对页面设置了缓存，则切到其它页面不会被销毁。

页面的进入和销毁分别对应 Module 上原有的方法： mount 和 destroy 。对于缓存的页面则多了
两个方法：onPageShow 和 onPageHide ，分别对应页面被显示和被隐藏，这两个方法是可选的。

| 方法       | 路由生命周期             |
| :--------- | :----------------------- |
| mount      | 进入页面                 |
| destroy    | 退出页面                 |
| onPageHide | 页面被缓存后隐藏         |
| onPageShow | 页面被缓存后再次显示出来 |

上以的四个方法不仅对页面的模块有用，对页面模块下的所有模块均有用，页面下的任何模块
实例拥有上述方法都会在相应的生命周期产生回调。

页面模块代码示例：

```ts
class Page extends DivModule {
  constructor() {
    super()
    // 省略页面逻辑.....
  }

  mount(parentEl: Element): void {
    super.mount(parentEl)
    showSuccess('路由页面完成挂载')
  }

  destroy(): void {
    super.destroy()
    showSuccess('路由页面销毁')
  }

  onPageHide() {
    showWarning('路由页面被隐藏')
  }

  onPageShow() {
    showSuccess('路由页面被显示')
  }
}
```

注意 mount 和 destroy 是覆写的父类方法，必须先调用父类的原方法。onPageHide 和 onPageShow
则是约定的方法，属于模块实例自有的，模块中有这个方法，就会在相应的机会被调用。
