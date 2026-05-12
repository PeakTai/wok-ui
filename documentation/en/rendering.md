# Rendering

Although built-in methods and conversion functions make it easy to organize content for modules, it can still be cumbersome for content that needs to change frequently. The library provides a full rendering scheme: whenever content needs to change, the entire module's content is rebuilt.

## Full Rendering Module

The library provides the abstract class `FullRenderingModule` to support full rendering. You can create a custom full rendering module by extending it.

```ts
class CustomModule extends FullRenderingModule {
  #count = 0

  constructor() {
    super(document.createElement('div'))
    // FullRenderingModule provides the render method; call render whenever rendering is needed
    this.render()
  }
  // Subclasses must implement the buildContent method, where the build logic goes
  protected buildContent(): void {
    this.addChild(
      `Count ${this.#count} `,
      // Button is a built-in module, introduced later
      new Button({
        text: 'Increment',
        onClick: ev => {
          // Change the count value, then render again
          this.#count++
          this.render()
        }
      })
    )
  }
}
```

The example above is simple: each time `render` is called, the `CustomModule`'s content is cleared, and then `buildContent` is called to re-add content.

## Immediate Rendering

By default, the `render` method does not render immediately but executes asynchronously. If `render` is called multiple times within a single synchronous flow, the calls are merged into a single render, and `buildContent` is called only once. In some special cases, immediate rendering may be needed. `render` accepts a parameter — set it to `true` to make rendering synchronous and execute immediately.

```ts
class CustomModule extends FullRenderingModule {
  constructor() {
    super()
    // Pass true as the first argument to force an immediate render
    this.render(true)
  }
}
```

## Caching

Full rendering has some side effects: all child modules are destroyed and recreated. Sometimes child modules are associated with many resources, causing performance issues. If a page has many images, removing and reloading image elements causes flickering, and the scroll position may also change. In such cases, use the full rendering module's method `cacheModule` to cache modules that don't need to be destroyed, avoiding these problems.

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
          // cacheModule can be used at any level
          // Cache modules that don't need to be re-rendered
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

In the example above, cached cover modules are not destroyed and rebuilt when `render` is called. They are only destroyed when the `List` module itself is destroyed.

You can also call `removeCache` at an appropriate time to delete the cached module for a specific key, or call `clearCaches` to clear all caches. Clearing caches immediately destroys the cached modules.

> However, caching modules has a side effect: because the cache itself is also a module bound to a DOM element, an extra `div` wraps the cached module, which may affect the originally designed structure and styles. Keep this in mind.
>
> -- Versions prior to 0.6

**The new version uses Proxy to implement caching, avoiding the side effect of the extra wrapping `div`. However, Proxy introduces new issues to be aware of.**

First, the `module` parameter of `cacheModule` is still a function type, but the function must return a `Module` instance, which may be incompatible with old code. Second, ES native private properties (names starting with `#`) cannot be proxied. Proxied modules must not use this syntax, otherwise re-rendering will throw an error.

For example, the following module cannot be cached:

```ts
class CanNotCacheModule extends FullRenderingModule {
  // #count cannot be proxied; caching this module may cause errors
  #count = 0
  // timerId can be proxied, no issue
  // Using TypeScript's private keyword is fine — the generated JS still uses regular properties
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
    // Because #count is a private property and cannot be proxied, accessing this.#count will cause:
    // Cannot read private member #count from an object whose class did not declare it
    this.addChild(`${this.#count} times`)
  }

  destroy() {
    clearTimeout(this.timerId)
    super.destroy()
  }
}
```

If you encounter an error like the following when using caching, it is caused by using private properties:

```
Cannot read private member #xxx from an object whose class did not declare it
```

## Responsive Module

By extending the `ResponsiveModule`, you can create a custom responsive module. `ResponsiveModule` differs from `FullRenderingModule` in that when the page size changes and crosses a breakpoint, it also triggers re-rendering. The `buildContent` method receives a size info parameter — there are no other differences.

Responsive breakpoints:

| Size | Width Description |
| :--- | :---------------- |
| xs   | <576px            |
| sm   | ≥576px            |
| md   | ≥768px            |
| lg   | ≥992px            |
| xl   | ≥1200px           |
| xxl  | ≥1400px           |

Example:

```ts
class List extends ResponsiveModule {
  private readonly list: Product[]

  constructor(list: Product[]) {
    super(document.createElement('div'))
    this.list = list
    this.render()
  }

  buildContent(sizeInfo: { respSize: ResponsiveSize; windowWidth: number }): void {
    // Decide how many columns per row based on size info
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
      // Use grid to display the list
      // Grid is a built-in module, introduced later
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

## Immediate Rendering

The `render` method of `ResponsiveModule` differs from `FullRenderingModule`. The first parameter indicates whether to force rendering — if set to `true`, rendering occurs regardless of whether the page size change crosses a breakpoint. The default is `true`. The second parameter indicates immediate rendering.

Definition:

```ts
/**
 * Request immediate rendering. Rendering executes asynchronously. Multiple render() calls
 * within a single program flow are merged into one to reduce overhead.
 * @param force Whether to force rendering. If false, no rendering occurs if size info hasn't changed
 * @param immediate Whether to render immediately. If true, rendering executes synchronously instead of asynchronously
 */
protected render(force = true, immediate = false): void 
```

Example:

```ts
class CustomModule extends ResponsiveModule {
  constructor() {
    super()
    // Force and immediately render once
    this.render(true, true)
  }
}
```
