---
title: Quick Start
order: 5
icon: fa-rocket
description: Get started with wok-ui quickly — installation, minimal usage, router and AI skill installation.
---

# Quick Start

## Installation

Install via npm:

```bash
npm i wok-ui --save
```

For users in China, network issues may occasionally prevent npm installations, often causing `ETIMEDOUT` errors. New versions may also experience delays in publishing to the npm registry. If you urgently need the latest version, you can install directly from the git repository:

```bash
npm install git+https://gitee.com/tai/wok-ui.git --save
```

## Minimal Usage

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

## Router

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

## AI Skill Installation

wok-ui provides an AI skill that, once installed, enables AI coding assistants to better understand and utilize wok-ui components.

```bash
npx skills add peaktai/wok-ui --all
```

For users in China with slow GitHub access, you can install from the gitee repository instead:

```bash
npx skills add https://gitee.com/tai/wok-ui.git --all
```
