# Router

For complex single-page applications, you can use the router component to organize pages, mapping each page to a URL and writing each page independently. The library comes with a built-in router implementation that supports path aliases and default pages, sufficient for most scenarios.

## Initializing the Router

Use the `initRouter` function to initialize a router. It returns a `Router` instance. `Router` is also a type of module, so after initialization you can directly mount it onto the body.

```ts
initRouter({
  // Mode: supports 'hash' and 'history'
  mode: 'history',
  /**
   * Base path, effective in history mode
   */
  base: '/docs/v3',
  // Rules
  rules: [
    // path: the URL path
    // alias: aliases, using alias paths also works, mainly for backward compatibility with old URLs
    // module: the page module, must be a function returning a Module instance
    { path: '/', alias: ['/list'], module: () => new HomePage() },
    // Dynamic paths with variables are supported
    { path: '/phones/:id', alias: ['/list'], module: () => new PhoneDetail() },
    { path: '*', module: () => new NotFound() }
  ]
  // Mount the router instance directly
}).mount(document.body)
```

This creates a router. Write a separate module for each page.

## Lazy Loading

To speed up initial loading, you can avoid loading all modules upfront and instead load pages on demand using the `import` function. The `module` parameter supports returning a `Promise<Module>`.

button.ts file:

```ts
export class Page extends DivModule {
  // Page logic omitted...
}
```

```ts
initRouter({
  mode: 'hash',
  rules: [
    { path: '/', alias: ['/list'], module: () => new HomePage() },
    // Load the 'button' page only when needed
    { path: 'button', module: () => import('./button').then(res => new res.Page()) },
    { path: '*', module: () => new NotFound() }
  ]
}).mount(document.body)
```

With the above setup, `button.ts` will be bundled as a separate file during build. It is only loaded when the `/button` page is requested. Of course, this requires bundler support to work.

## Getting Parameters

Use the `getRouter` function to get the router instance. Through the router instance, you can access path variables and query parameters.

```ts
/**
 * List page
 */
class List extends DivModule {
  constructor() {
    super()
    // Request URL: /list?keyword=phone&tag=ios&tag=android
    const router = getRouter()
    const keyword = router.getParam('keyword') // 'phone'
    const tags = router.getParamVals('tag') // ['ios','android']
  }
}
```

Example of getting path variables:

```ts
/**
 * Book detail page
 */
class BookDetail extends DivModule {
  constructor() {
    super()
    // Router path setting: /books/:id
    // Request URL: /books/0001
    const router = getRouter()
    const id = router.getPathVar('id') // '0001'
  }
}
```

## Page Navigation

Use the `push` and `replace` methods on the router instance to navigate. `push` adds a new history entry, while `replace` replaces the current one.

```ts
// push accepts a path string directly, or an object with path and query parameters
getRouter().push('books')
getRouter().push({ path: 'books', query: { tag: 'coding' } })
// replace has the same parameter type as push
// The difference is that replace replaces the current page; going back won't return to this page
getRouter().replace('books')
getRouter().replace({ path: 'books', query: { tag: 'coding' } })
```

## Layout Reuse

Route rules do not support nesting — that would be too confusing and hard to maintain. Route modules should not have parent-child relationships.

For layout reuse, the recommended approach is to encapsulate the layout as a module.

Layout file layout.ts:

```ts
export class Layout extends DivModule {
  /**
   * @param content The content to embed into the layout
   */
  constructor(content: SubModulesOpt) {
    super('layout')
    this.addChild(
      {
        classNames: 'header',
        children: [
          // Omitted...
        ]
      },
      {
        classNames: 'body',
        // Content is embedded here
        children: content
      },
      {
        classNames: 'footer',
        children: [
          // Omitted...
        ]
      }
    )
  }
}
```

Page using the layout, list.ts:

```ts
import { Layout } from './layout'
/**
 * List page
 */
class Page extends DivModule {
  // Omitted...
}
/**
 * Export a function that builds the page, creating a page module wrapped with the layout
 */
export function listPage() {
  return new Layout(new Page())
}
```

Router initialization code:

```ts
import { listPage } from './list.ts'

initRouter({
  mode: 'hash',
  rules: [{ path: '/', alias: ['/list'], module: listPage }]
}).mount(document.body)
```

Prefer composition for layout reuse. For special requirements (e.g., the page module needs to interact with the layout), inheritance can also be used, but this introduces higher coupling — use with caution.

## Caching

If you want a page to retain its state when navigating back — avoiding re-fetching data and re-rendering — use caching.

```ts
initRouter({
  mode: 'hash',
  // Maximum number of cached pages
  cacheLimit: 10,
  // Add the cache parameter in the rule, set to true to cache the page
  rules: [{ path: '/', alias: ['/list'], module: listPage, cache: true }]
}).mount(document.body)
```

Caching is handled based on parameters. The same route with different parameters caches different pages — for example, `/list?q=1` and `/list?q=2` are two separate pages. Caching works by preserving the original page object and DOM element, so keep the limit low. Caching too many pages can lead to high memory usage, page lag, or even crashes.

The router instance provides three methods to clear page caches:

| Method                 | Description                                     |
| :--------------------- | :---------------------------------------------- |
| removeCurrentPageCache | Clear the current page's cache                  |
| removeCacheByPath      | Remove all caches under a specified path        |
| removeCache            | Remove caches using custom filtering rules      |

Examples:

```ts
// Delete the current page's cache
getRouter().removeCurrentPageCache()
// Delete all caches under path /list
getRouter().removeCacheByPath('list')
// Custom filter function: delete caches under /list where parameter q is 2
getRouter().removeCache(route => route.query && route.query.q === '2')
```

## Lifecycle

Each page has a lifecycle. When the router navigates to a page, the page module is mounted. When navigating away, the current page module is destroyed. If caching is enabled, the page is not destroyed when navigating away.

Entering and leaving a page correspond to the existing `Module` methods: `mount` and `destroy`. For cached pages, there are two additional methods: `onPageShow` and `onPageHide`, corresponding to the page being shown and hidden. Both are optional.

| Method     | Router Lifecycle                        |
| :--------- | :-------------------------------------- |
| mount      | Entering the page                       |
| destroy    | Leaving the page                        |
| onPageHide | Page is cached and hidden               |
| onPageShow | Cached page is shown again              |

These four methods apply not only to the page module but to all modules under it. Any module instance within the page that has these methods will receive callbacks at the corresponding lifecycle events.

Page module code example:

```ts
class Page extends DivModule {
  constructor() {
    super()
    // Page logic omitted...
  }

  mount(parentEl: Element): void {
    super.mount(parentEl)
    showSuccess('Route page mounted')
  }
```
