---
title: Design Philosophy
order: 3
icon: fa-lightbulb
description: Design philosophy of wok-ui.
---

# Design Philosophy

## Pragmatism

The core design principle of wok-ui is simple: **pragmatism**. We don't chase the latest tech trends or the richest APIs. We solve real problems with the fewest concepts and the most intuitive approach.

### Simplicity and Intuition

A good framework should let developers understand what the code does at a glance, without needing to grasp a pile of abstract concepts first.

wok-ui insists that **there is only one correct way to do one thing**. There is no agonizing between multiple styles and no burden of "which API should I use". The code you write is the logic that executes, with no hidden compilation steps and no implicit framework behavior.

### Object-Oriented Literal Construction

wok-ui modules are classes, and DOM structures are described by literal objects:

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

This style has several characteristics:

- **Code is structure**: What you see is the DOM tree, no need to switch between templates, scripts, and styles
- **Type safety**: TypeScript constraints run throughout, IDE hints serve as documentation
- **No compilation magic**: What you write is what executes, with no extra transformation steps and no reactivity proxies

### Explicit over Implicit

wok-ui doesn't believe in "magic". State changed? Call `render()`. Module no longer needed? Call `destroy()`. Need caching? Declare it explicitly with `cacheModule()`.

This explicit design means:

- When state updates and when the view refreshes are decided by when you call `render()`
- When a module is mounted and destroyed is clearly defined by `mount()` and `destroy()`
- Every behavior comes from the code you wrote, with no extra implicit rules

The cost is writing a few more lines of code. The benefit is **completely predictable behavior**.

---

## Advantages for AI Programming

wok-ui's design philosophy happens to align perfectly with how current AI code generation works.

### Why wok-ui Suits AI Programming

#### 1. Fewer Concepts, Fewer Choices

AI generates code based on probabilistic prediction. The more concepts and choices a framework has, the higher the probability of AI making mistakes.

wok-ui offers only one way to do each thing:

| Scenario             | How wok-ui does it                          |
| :------------------- | :------------------------------------------ |
| Reactive data        | Modify properties directly, call `render()` |
| Conditional rendering| Callback function `add => { if (x) add(...) }` |
| Lifecycle            | `mount()` / `destroy()`                     |

No coexisting sets of APIs and no burden of "which style to use" — **the only path is the correct path**.

#### 2. No Implicit Rules

wok-ui has no rules that "you must know but the framework won't tell you". All constraints are explicit, typed, and verifiable at runtime.

#### 3. High Token Efficiency

For the same functionality, wok-ui expresses it with fewer tokens:

```ts
// wok-ui: ~15 tokens
new Button({ text: 'Confirm', type: 'primary', onClick: submit })
```

Less code means:

- Faster AI generation
- Context window can accommodate more business logic
- Fewer tokens consumed when fixing errors

#### 4. Intuitive and Fixable Errors

Common mistakes in wok-ui are explicit omissions, such as forgetting to call `render()` or forgetting to reuse a module. Just add them back.

These errors don't require understanding framework internals, because the framework has no internals — code is behavior.

### Applicable Scenarios

wok-ui is particularly suitable for the following AI-assisted programming scenarios:

- **Rapid prototyping**: AI generates large amounts of CRUD pages, wok-ui's concise API makes generation quality more stable
- **Internal management systems**: Forms, tables, and dialogs are the core, directly covered by wok-ui's built-in modules
- **Low-code/no-code platforms**: The literal DOM construction approach is naturally suitable for visual configuration-to-code conversion
- **AI code assistant integration**: As a "recommended framework" in the knowledge base, reducing AI's decision points and error rates

### Summary

wok-ui's pragmatic design makes it a good fit for projects of any scale:

- **Lightweight and easy to maintain**: Few concepts and no third-party dependencies keep maintenance costs low even after years of iteration, and many projects have been built on wok-ui and maintained over the long term
- **Details that stand up to scrutiny**: The built-in components are basic, but their interactions, responsiveness, and type constraints are carefully refined — enough to support enterprise-grade applications
- **Friendly to AI programming**: One way to do each thing, no implicit rules, and code as behavior let both developers and AI assistants produce high-quality code consistently
- **Predictable behavior**: Rendering and lifecycle are fully explicit, making long-term evolution and collaboration more controllable

Whether you are validating an idea or building a long-term enterprise system, wok-ui is an efficient and reliable choice.
