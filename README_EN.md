[中文文档](./README.md)

# wok-ui

wok-ui is a frontend UI component library with the following characteristics: simple, intuitive, low cognitive overhead; responsive design; zero third-party dependencies; TypeScript-based with complete type constraints.

[View online demo.](https://peaktai.github.io/wok-ui/)

[View full documentation.](./documentation/en/index.md)

## Advantages

- Low learning curve, close to bare DOM
- Strong type inference for more efficient development, catching errors at compile time whenever possible
- Small bundle size yet fairly feature-rich, zero third-party dependencies
- No dynamic proxies or virtual layers, fewer pitfalls, low cognitive overhead, decent performance

## Philosophy

- Not chasing feature completeness — stay restrained, only implement essential functionality, keep it simple
- Object-oriented, easy to understand, convenient for encapsulation and abstraction, yet flexible
- Modular, facilitating complex business decomposition with single responsibilities and focused code
- No support for legacy browsers — don't waste time on meaningless things

## Quick Start

Install via npm:

```
npm i wok-ui --save
```

> For users in China: network issues may occasionally prevent npm installations, often causing `ETIMEDOUT` errors. New versions may also experience delays in publishing to the npm registry. If you urgently need the latest version, you can install directly from the git repository:
>
> ```
> npm install git+https://gitee.com/tai/wok-ui.git --save
> ```

Entry file `src/main.ts` example:

```ts
import 'wok-ui/dist/style.css'
import { DivModule, Text } from 'wok-ui'
// Page module — extend Module or DivModule to build a new module
class Page extends DivModule {
  constructor() {
    super()
    this.addChild(new Text('Hello world !'))
  }
}
// Create a page module instance and mount it to the body
new Page().mount(document.body)
```

### Router

To use the router, call the `initRouter` function. It returns a `Router` instance, which is also a module and can be mounted directly to the body.

```ts
import 'wok-ui/dist/style.css'
import { initRouter, DivModule, Text } from 'wok-ui'
// Home page module — for complex projects, pages should be split into separate files
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

For more usage details, please [refer to the documentation](./documentation/en/index.md).
