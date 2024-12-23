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

布局的复用尽可能使用组合的方式，一些特殊的需求（如页面模块内部需要与布局交互）也可以使用继承的方式，
这种情况耦合度会高一些，需要谨慎。

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

路由实例提供了三个方法来清理页面缓存。

| 方法                   | 说明                       |
| :--------------------- | :------------------------- |
| removeCurrentPageCache | 清除当前页面的缓存         |
| removeCacheByPath      | 删除指定路径下的所有缓存   |
| removeCache            | 通过自定义的规则来删除缓存 |


下面是示例：

```ts
// 删除当前页面下的缓存
getRouter().removeCurrentPageCache()
// 删除路径 /list 下的所有缓存
getRouter().removeCacheByPath('list')
// 自定义过滤函数，删除 /list 路径下，参数 q 为 2 的缓存
getRouter().removeCache(route => route.query && route.query.q === '2')
```

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

## 钩子函数

从 0.9.0 版本开始，新增了路由的钩子函数，可以在路由导航切换页面的过程中进行一些额外的操作，
部分钩子可以改变流程，实现一些特殊需求。

钩子函数需要在初始化路由时传递，对所有页面有效。定义如下：

```ts
// 路由初始化参数
interface RouterInitOpts:{
  // 其它参数省略，可通过代码中的定义文件查看 ...
  /**
   * 钩子，部分函数能够影响流程，在路由导航处理失败的情况下，页面地址也不会回退
   */
  hooks?: {
    /**
     * 在路由导航之前执行，来决定是否要进行导航
     * @param to 要导航的目标路由信息
     * @param from 来源路由信息，表示用户是从哪个路由导航来的
     * @returns 布尔值来表示是否继续进行路由导航
     * @throws 发生异常的情况下，路由导航也会被中止
     */
    beforeEach?: (to: Route, from: Route) => Promise<boolean> | boolean
    /**
     * 在路由导航处理完成后执行，不管处理成功与否，即便在 beforeEach 钩子中返回 false 也会执行 afterEach，
     * 总之每次导航必定会触发一次 afterEach
     * @param to 要导航的目标路由信息
     * @param from 来源路由信息，表示用户是从哪个路由导航来的
     * @param  isSuccess 此次导航是否成功，如果导航过程发生异常或被 beforeEach 阻止切换都会不成功
     * @returns 返回结果不会影响流程
     */
    afterEach?: (to: Route, from: Route, isSuccess: boolean) => void
    /**
     * 错误处理，可以在发生错误的情况下做一些额外的处理，比如重新导航到某个特定页面。
     * 如果没有指定 errorHandler 则会由路由组件处理错误，默认会弹出提示。
     * @param error 错误信息
     * @param to 要导航的目标路由信息
     * @param from 来源路由信息，表示用户是从哪个路由导航来的
     * @returns
     */
    errorHandler?: (error: any, to: Route, from: Route) => void
  }
}
```

下面是示例：

```ts
initRouter({
  mode: 'hash',
  rules: [
    // 省略...
  ],
  hooks: {
    // 前置处理，可以改变流程，阻止页面切换
    async beforeEach(to, from) {
      // 比如可以进行检查权限，阻止无权限的用户访问
      // 拦截 /admin/ 开头的地址
      if (to.path.startsWith('/admin/')) {
        const res = await checkPermissions()
        if (res) {
          return true
        } else {
          // 权限检查失败，返回 false 阻止切换，并导航去特定的页面
          getRouter().replace('/403')
          return false
        }
      }
      // 其它地址放行
      return true
    },
    // 执行后置逻辑
    afterEach(to, from, isSuccess) {
      // 例如，跟踪路由变化，记一些日志等
      trackNavigation(to, from, isSuccess)
    },
    // 处理导航中发生的错误
    errorHandler(error, to, from) {
      // 可以在发生错误发生时，重新导航到特定页面进行展示
      const msg = error instanceof Error ? error.message : `${error}`
      getRouter().replace({ path: '/503', query: { msg } })
      // 也可以做日志记录或者别的处理
    }
  }
}).mount(document.body)
```

如果 beforeEach 钩子的处理需要一定的时间，在这段时间里页面是保持不变的，
可以考虑（通过消息提示组件）添加一个全局 loading 来进行过渡，防止在等待的过程中，
用户在页面中继续操作造成干扰或重复提交。