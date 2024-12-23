# 渲染

虽然通过一系列的内置方法和转换函数可以很方便的为模块组织内容，但是对于需要经常变化内容来说还是很麻烦。
组件库提供了全量渲染的方案，也就是每当内容需要变化时整个模块的内容重新构建。

## 全量渲染模块

组件库提供了抽象类 FullRenderingModule 来支持全量渲染，可以通过继承来自定义一个全量渲染模块。

```ts
class CustomModule extends FullRenderingModule {
  #count = 0

  constructor() {
    super(document.createElement('div'))
    // FullRenderingModule 提供了 render 方法，每次需要渲染就调用 render 方法
    this.render()
  }
  // 子类需要实现 buildContent 方法，在这个方法中编写构建逻辑
  protected buildContent(): void {
    this.addChild(
      `次数 ${this.#count} `,
      // 按钮也是内置一种模块，后面会介绍
      new Button({
        text: '增加',
        onClick: ev => {
          // 更改 count 的值，然后再次渲染
          this.#count++
          this.render()
        }
      })
    )
  }
}
```

上面是一个简单的示例，每次渲染实际上 CustomModule 的内容会被清空，然后调用 buildContent 重新添加。

## 立即渲染

默认情况下 render 方法是不会立即渲染的，而是会异步执行，如果一次的同步执行的流程调用多次 render 方法，
最终会被合并只执行一次渲染，buildContent 只会被调用一次。一些特殊情况，可能需要立即进行渲染，
render 支持一个参数，设置为 true ，可以让渲染变成同步的，立即执行一次。

```ts
class CustomModule extends FullRenderingModule {
  constructor() {
    super()
    // 传递第一个参数为 true ，强制立即渲染一次
    this.render(true)
  }
}
```

## 缓存

全量渲染会有一些副作用，所有的子模块会被销毁掉，然后重新再创建，有时候子模块会关联很多资源，导致性能问题。
如果页面上有很多图片，由于图片元素被删除了然后再重新加载，就会发生页面闪烁，并且页面的滚动条位置也会产生变化。
这种情况可以使用全量渲染模块的方法 cacheModule 来缓存不需要被销毁的模块避免这些问题。

```ts
class List extends FullRenderingModule {
  private readonly list: Product[]

  constructor(list: Product[]) {
    super(document.createElement('div'))
    this.list = list
    this.render()
  }

  protected buildContent(): void {
    for (const item of this.list) {
      this.addChild({
        classNames: 'item',
        children: [
          // cacheModule 可以在任意位置层级使用
          // 缓存不需要被重新渲染的模块
          this.cacheModule({
            key: `cover-${item.id}`,
            module: () => ({ classNames: 'cover', tag: 'img', attrs: { src: item.coverUrl } })
          }),
          12,
          item.name
        ]
      })
    }
  }
}
```

在上面的例子中被缓存的封面模块在调用 render 方法重新渲染内容时不会被销毁和重建，在 List 模块销毁时
这些缓存的模块才会被销毁。

也可以在适当的时候调用 removeCache 方法来删除指定 key 的模块缓存，还可以调用 clearCaches 方法
清理掉所有缓存。清理缓存会让被缓存的模块立即销毁。

> 但是缓存模块会带来副作用，因为缓存本身也是一种模块，会绑定一个 dom 元素，所以被缓存的模块外面就多了一层 div，
>有可能会影响原本已经设计好的结构和样式，这个需要注意。
>
> -- 0.6 之前的版本

**新版本已经改用代理（Proxy）来实现缓存，避免了多套一层 div 的副作用，但是代理也带来了新问题需要注意。**

首先是 cacheModule 方法的参数 module 仍然是函数类型，但是函数必须返回 Module 实例，可能会与旧代码不兼容。
其次就是 es 原生的私有属性（名称以 # 开头的属性）是无法代理的，被代理的模块中不能使用这个语法，否则重新渲染会报错。

比如下面的例子，模块就是不能被缓存的。

```ts
class CanNotCacheModule extends FullRenderingModule {
  // # count无法被代理，将模块缓存可能会报错
  #count = 0
  // timerId 是可以被代理的，无影响
  // 使用 ts 的语法 private 是可以的，最终生成的 js 仍然是普通的属性
  private timerId = 0

  constructor() {
    super()
    this.render()
    this.timerId = setTimeout(() => {
      this.#count++
      this.render()
    }, 1000)
  }

  protected buildContent(): void {
    // 由于 #count 是私有属性，无法被代理，调用 this.#count 将会出现下的错误：
    // Cannot read private member #count from an object whose class did not declare it
    this.addChild(`${this.#count}次`)
  }

  destroy() {
    clearTimeout(this.timerId)
    super.destroy()
  }
}
```

如果使用缓存出现下面的类似错误，就是使用私有属性导致的。

```
Cannot read private member #xxx from an object whose class did not declare it
```

## 响应式模块

通过继承 ResponsiveModule 模块可实现自定义的响应式模块，ResponsiveModule 和 FullRenderingModule 不同的点在于
页面尺寸变化时，如果达到分隔点，也会触发重新渲染。buildContent 方法增加尺寸信息参数，除此之外没有区别。

响应式分隔点：

| 尺寸 | 宽度说明 |
| :--- | :------- |
| xs   | <576px   |
| sm   | ≥576px   |
| md   | ≥768px   |
| lg   | ≥992px   |
| xl   | ≥1200px  |
| xxl  | ≥1400px  |

示例：

```ts
class List extends ResponsiveModule {
  private readonly list: Product[]

  constructor(list: Product[]) {
    super(document.createElement('div'))
    this.list = list
    this.render()
  }

  buildContent(sizeInfo: { respSize: ResponsiveSize; windowWidth: number }): void {
    // 根据尺寸信息来决定每行显示几列
    let cols = 2
    switch (sizeInfo.respSize) {
      case 'xs':
        cols = 2
      case 'sm':
        cols = 3
      case 'md':
        cols = 4
      case 'lg':
        cols = 5
      case 'xl':
        cols = 6
      case 'xxl':
        cols = 6
        break
    }
    this.addChild(
      // 使用网格来展示列表
      // 网络是一个内置模块，后面会介绍
      new Grid({
        cols,
        gap: 12,
        cells: this.list.map(item => ({
          classNames: 'item',
          children: [
            this.cacheModule({
              key: `cover-${item.id}`,
              module: () => ({ classNames: 'cover', tag: 'img', attrs: { src: item.coverUrl } })
            }),
            12,
            item.name
          ]
        }))
      })
    )
  }
}
```

## 立即渲染

ResponsiveModule 模块的 render 方法与 FullRenderingModule 有所不同，第一个表示的是否强制渲染，
如果设置为 true 表示不管页面的尺寸变化是否达到分隔点都进行渲染，默认为 true ，第二个参数才表示的是立即渲染。

定义如下：

```ts
/**
 * 请求立即进行渲染.渲染会异步执行，一次程序流程中有多次调用 render() 方法的，会合并成为一次，减少消耗.
 * @param force 是否强制渲染,如果为 false ,则在尺寸信息不变化的情况下不会渲染
 * @param immediate 是否立即渲染，如果设置为 true 则渲染会立同步执行，而不是异步
 */
protected render(force = true, immediate = false): void 
```

示例：

```ts
class CustomModule extends ResponsiveModule {
  constructor() {
    super()
    // 强制并立即渲染一次
    this.render(true,true)
  }
}
```
