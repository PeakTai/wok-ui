[中文文档](./README.md)

# wok-ui

wok-ui is a frontend UI component library with the following characteristics: simple, intuitive, low cognitive overhead; responsive design; zero third-party dependencies; TypeScript-based with complete type constraints.

[View online demo.](https://peaktai.github.io/wok-ui/)

[View full documentation.](./documentation/en/index.md)

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

### AI Skill Installation

wok-ui provides an AI skill that, once installed, enables AI coding assistants to better understand and utilize wok-ui components.

```bash
npx skills add peaktai/wok-ui --all
```

For more usage details, please [refer to the documentation](./documentation/en/index.md).

## Why wok-ui

### Low Learning Curve, Close to Native DOM

You only need basic TypeScript and DOM knowledge to get started. No virtual DOM, no reactivity system, no JSX compilation, no lifecycle hooks — very few concepts to learn. If you can write native JavaScript to manipulate the DOM, you can use wok-ui with minimal additional learning.

### Coding Like Building Blocks

Modules are classes, and DOM structures are described by literal objects. The code you write is the logic that executes — no hidden compilation steps, no abstract concepts to grasp. Newcomers can read it, experienced developers write it fast.

```ts
this.addChild({
  classNames: 'card',
  children: [
    { tag: 'h3', innerText: 'Title' },
    16, // spacer
    { tag: 'p', innerText: 'Content' }
  ]
})
```

### Type Safety Throughout

Built on TypeScript, from component parameters to event callbacks, everything has complete type constraints. IDE hints serve as documentation, and most errors are caught at compile time. No additional type definition files needed.

### Zero Dependencies, Lightweight and Controllable

Zero third-party dependencies, small bundle size. No virtual DOM, no reactive proxies — behavior is completely predictable. When something goes wrong, you can locate the issue by reading the source code, without diving into framework black boxes.

### Built-in Essentials, Ready to Use

Forms, tables, dialogs, routing, animations, internationalization, and other foundational capabilities are built-in. No need to evaluate and select supporting ecosystems, reducing decision costs. Consistent style, consistent API design.

### AI Programming Friendly

Fewer concepts, clear rules — AI generates code with more stable quality. Compact code, the same functionality consumes fewer tokens. Errors are intuitive, fixes don't require understanding framework internals.
