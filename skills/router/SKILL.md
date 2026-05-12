---
name: router
description: 介绍 wok-ui 路由系统的使用方法，包括路由初始化、路径规则与别名、按需加载、参数获取、页面跳转、布局复用、缓存、生命周期与钩子函数。
license: MIT
metadata:
  author: Peak Tai
  email: peaktai@qq.com
---

# 路由

wok-ui 内置了轻量级路由系统，支持 hash 和 history 两种模式，提供路径变量、查询参数、页面缓存、按需加载和导航钩子等功能，足以应付大多数单页应用场景。

> **源码位置**：安装 wok-ui 后，路由模块的源码位于项目中的 `node_modules/wok-ui/lib/router/` 目录下。
> 主要文件：
> - `index.ts` — `initRouter` / `getRouter` 函数
> - `router.ts` — `Router` 抽象基类（生命周期、缓存、钩子逻辑）
> - `hash-router.ts` — hash 模式路由实现
> - `history-router.ts` — history 模式路由实现
> - `router-link.ts` — `RouterLink` 组件
> - `path.ts` — 路径匹配与解析
> - `cache.ts` — `CachedModule` 缓存机制
>
> 也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认路由相关的导出接口。
>
> 如果当前处于 wok-ui 仓库本身，源码可直接在 `lib/router/` 目录下查看。

## 初始化路由

通过 `initRouter` 函数初始化路由，返回 `Router` 实例。`Router` 本身也是一个 `Module`，可直接挂载到 `document.body`。

```ts
import { initRouter } from 'wok-ui'

initRouter({
  mode: 'history',
  base: '/docs/v3',
  rules: [
    { path: '/', alias: ['/list'], module: () => new HomePage() },
    { path: '/phones/:id', module: () => new PhoneDetail() },
    { path: '*', module: () => new NotFound() }
  ]
}).mount(document.body)
```

### 模式

`mode` 支持两种：

| 模式      | 说明                                                   |
| --------- | ------------------------------------------------------ |
| `hash`    | URL 使用 `#` 分隔，如 `/app/#/page`，兼容性最好        |
| `history` | 使用 HTML5 History API，URL 更干净，需服务端配合       |

`history` 模式下可通过 `base` 选项指定基础路径。

### 路由规则

每个规则包含以下字段：

| 字段     | 类型                                                  | 说明                                       |
| -------- | ----------------------------------------------------- | ------------------------------------------ |
| `path`   | `string`                                              | 路径，支持变量如 `/users/:userId`，`*` 匹配默认页面 |
| `alias`  | `string[]`                                            | 别名路径，用于兼容旧地址                   |
| `module` | `() => Module \| Promise<Module>`                     | 模块工厂函数                               |
| `cache`  | `boolean`                                             | 是否缓存页面                               |

```ts
initRouter({
  mode: 'hash',
  rules: [
    // 带别名的规则
    { path: '/', alias: ['/list'], module: () => new HomePage() },
    // 动态路径变量
    { path: '/phones/:id', module: () => new PhoneDetail() },
    // 默认页面（兜底匹配）
    { path: '*', module: () => new NotFound() }
  ]
})
```

> **注意**：路由规则不支持嵌套，每个路由模块间不应有层级关系。

## 按需加载

`module` 参数支持返回 `Promise<Module>`，配合 `import()` 可实现页面按需加载，减小初始打包体积：

```ts
// 页面模块单独文件 detail.ts
export class DetailPage extends DivModule {
  // ...
}
```

```ts
initRouter({
  mode: 'hash',
  rules: [
    { path: '/', module: () => new HomePage() },
    // 按需加载：访问 /detail 时才加载该文件
    { path: '/detail', module: () => import('./detail').then(m => new m.DetailPage()) },
    { path: '*', module: () => new NotFound() }
  ]
})
```

## 获取路由参数

通过 `getRouter()` 获取当前路由实例，从中提取路径变量和查询参数。

### 查询参数

```ts
import { getRouter } from 'wok-ui'

const router = getRouter()
// URL: /list?keyword=phone&tag=ios&tag=android
const keyword = router.getParam('keyword')    // 'phone'
const tags = router.getParamVals('tag')       // ['ios', 'android']
```

### 路径变量

```ts
// 路由 path 设置为 /books/:id
// 请求地址：/books/0001
const router = getRouter()
const id = router.getPathVar('id')  // '0001'
```

## 页面跳转

通过路由实例的 `push` 和 `replace` 方法进行页面跳转。

```ts
const router = getRouter()

// push：新增历史记录，可后退
router.push('books')
router.push({ path: 'books', query: { tag: 'coding' } })

// replace：替换当前历史记录，不可后退回当前页
router.replace('books')
router.replace({ path: 'books', query: { tag: 'coding' } })
```

### RouterLink

推荐使用 `RouterLink` 组件代替 API 调用来实现链接跳转，有利于 SEO：

```ts
import { RouterLink } from 'wok-ui'

new RouterLink({
  path: 'books',
  query: { tag: 'coding' },
  content: '查看编程书籍'
})

// 替换模式跳转
new RouterLink({
  path: 'login',
  replace: true,
  content: '去登录'
})
```

| 选项      | 类型               | 默认值  | 说明                           |
| --------- | ------------------ | ------- | ------------------------------ |
| `path`    | `string`           | 必填    | 目标路径                       |
| `query`   | `Query`            | -       | 查询参数                       |
| `replace` | `boolean`          | `false` | 是否以 replace 方式跳转       |
| `content` | `Module \| string` | 必填    | 链接内容                       |

路由注册：

```ts
import { listPage } from './list'

initRouter({
  mode: 'hash',
  rules: [{ path: '/', module: listPage }]
})
```

## 页面缓存

启用缓存后，离开页面时模块和 DOM 会被保留，再次进入时直接恢复，无需重新渲染和请求数据。同一个路由不同参数会缓存为不同页面（如 `/list?q=1` 和 `/list?q=2` 是两个缓存）。

```ts
initRouter({
  mode: 'hash',
  cacheLimit: 10,
  rules: [
    { path: '/', module: () => new HomePage(), cache: true }
  ]
})
```

### 清除缓存

路由实例提供了三个清理缓存的方法：

```ts
const router = getRouter()

// 清除当前页面缓存
router.removeCurrentPageCache()

// 删除指定路径下的所有缓存
router.removeCacheByPath('list')

// 自定义过滤删除：删除 /list 路径下 q=2 的缓存
router.removeCache(route => route.query && route.query.q === '2')
```

## 生命周期

路由中的模块有以下生命周期方法：

| 方法           | 触发时机                       | 类型                  |
| -------------- | ------------------------------ | --------------------- |
| `mount()`      | 进入页面（首次挂载）           | 覆写 `Module` 方法    |
| `destroy()`    | 退出页面（未缓存的页面）       | 覆写 `Module` 方法    |
| `onPageShow()` | 缓存的页面被重新显示           | 约定方法（可选）      |
| `onPageHide()` | 页面被缓存后隐藏               | 约定方法（可选）      |

这四个方法对页面模块及其**所有子孙模块**均有效。

```ts
class Page extends DivModule {
  mount(parentEl: Element): void {
    super.mount(parentEl)
    console.log('页面挂载完成')
  }

  destroy(): void {
    super.destroy()
    console.log('页面已销毁')
  }

  onPageHide() {
    console.log('页面被缓存隐藏')
  }

  onPageShow() {
    console.log('缓存的页面重新显示')
  }
}
```

> **注意**：`mount` 和 `destroy` 是覆写方法，必须先调用 `super.mount()` / `super.destroy()`。`onPageShow` / `onPageHide` 为约定方法，直接定义即可。

## 导航钩子

钩子函数在 `initRouter` 时注册，对所有页面生效：

```ts
initRouter({
  mode: 'hash',
  rules: [/* ... */],
  hooks: {
    // 导航前执行，可阻止跳转或返回替代模块
    async beforeEach(to, from) {
      if (to.path.startsWith('/admin/')) {
        const hasPermission = await checkPermissions()
        if (!hasPermission) {
          return new ForbiddenPage() // 返回模块替代原页面
        }
      }
      return true // 放行
    },

    // 导航完成后执行（必定触发）
    afterEach(to, from, isSuccess) {
      trackNavigation(to, from, isSuccess)
    },

    // 导航异常时执行
    errorHandler(error, to, from) {
      return new ErrorPage(error) // 返回自定义错误页
    }
  }
})
```

### 钩子参考

| 钩子           | 签名                                                              | 返回值影响         |
| -------------- | ----------------------------------------------------------------- | ----------------- |
| `beforeEach`   | `(to: Route, from: Route) => boolean \| Module \| Promise<...>`   | `false` 阻止跳转；`Module` 替代渲染 |
| `afterEach`    | `(to: Route, from: Route, isSuccess: boolean) => void`            | 不影响流程         |
| `errorHandler` | `(error: any, to: Route, from: Route) => void \| Module \| Promise<Module>` | 返回 `Module` 替代渲染 |

> **提示**：如果 `beforeEach` 处理时间较长，建议使用全局 loading 进行过渡，防止用户在此期间重复操作。

> **注意**：`beforeEach` 和 `errorHandler` 返回的自定义模块不会被缓存，不受路由 `cache` 配置的影响。

## 核心 API 参考

### initRouter(opts) → Router

| 选项        | 类型                   | 默认值 | 说明                    |
| ----------- | ---------------------- | ------ | ----------------------- |
| `mode`      | `'hash' \| 'history'`  | 必填   | 路由模式                |
| `base`      | `string`               | -      | 基础路径（history 有效） |
| `rules`     | `RouterRule[]`         | 必填   | 路由规则                |
| `cacheLimit`| `number`               | `10`   | 最大缓存页面数量        |
| `hooks`     | 见钩子参考              | -      | 导航钩子                |

### Router 实例方法

| 方法                        | 说明                                     |
| --------------------------- | ---------------------------------------- |
| `push(loc)`                 | 跳转页面，新增历史记录                   |
| `replace(loc)`              | 替换当前历史记录跳转                     |
| `getParam(name): string`    | 获取查询参数第一个值                     |
| `getParamVals(name): string[]` | 获取查询参数所有值                    |
| `getPathVar(name): string`  | 获取路径变量值                           |
| `getRouterInfo(): Route`    | 获取当前路由信息                         |
| `buildUrl(loc): string`     | 构建完整 URL                             |
| `removeCurrentPageCache()`  | 清除当前页缓存                           |
| `removeCacheByPath(path)`   | 按路径清除缓存                           |
| `removeCache(filter)`       | 自定义过滤清除缓存                       |

### Route 类型

```ts
interface Route {
  path: string
  query?: Query
}
```

### RouterLink 组件

用于声明式页面跳转，选项见上方 RouterLink 章节。
