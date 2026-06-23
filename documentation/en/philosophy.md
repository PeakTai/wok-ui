# Design Philosophy

## Pragmatism

The core design principle of wok-ui is simple: **pragmatism**. We don't chase the latest tech trends or the richest APIs. We solve real problems with the fewest concepts and the most intuitive approach.

### Simplicity and Intuition

wok-ui believes a good framework should let developers understand what the code does at a glance, without needing to grasp a pile of abstract concepts first.

Compare it with mainstream frameworks today:

| Framework | Concepts needed to write a button |
|-----------|-----------------------------------|
| **Vue 3** | Template syntax, reactivity system (ref/reactive), event binding, component registration, style scoping |
| **React** | JSX syntax, function components, hooks (useState/useCallback), event synthesis, virtual DOM |
| **wok-ui** | `new Button({ text: 'Click', onClick: fn })` |

Vue and React are excellent frameworks, but their design goals are to **cover as many scenarios and developer skill levels as possible**. Vue 3 supports both Options API and Composition API simultaneously; React's hooks offer immense flexibility. These choices are friendly to human developers, but for scenarios that prioritize efficiency, **too many choices become a burden**.

wok-ui takes a different path: **there is only one correct way to do one thing**. No纠结 over Options vs Composition API, no confusion between ref and reactive, no traps with useEffect dependency arrays. The code you write is the logic that executes, with no hidden compilation steps and no implicit framework behavior.

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
- **No compilation magic**: No JSX transformation, no template compilation, no reactivity proxy. Code executes exactly as written.

### Explicit over Implicit

wok-ui doesn't believe in "magic". State changed? Call `render()`. Module no longer needed? Call `destroy()`. Need caching? Declare it explicitly with `cacheModule()`.

This explicit design means:
- No unexpected behavior from "automatic tracking" in a reactivity system
- No implicit call order for lifecycle hooks
- No complex transformation rules behind syntax sugar

The cost is writing a few more lines of code. The benefit is **completely predictable behavior**.

---

## Advantages for AI Programming

wok-ui's design philosophy happens to align perfectly with how current AI code generation works.

### Why wok-ui is Better Suited for AI Programming

#### 1. Fewer Concepts, Fewer Errors

AI generates code based on probabilistic prediction. The more concepts and choices a framework has, the higher the probability of AI making mistakes.

| Scenario | Vue 3 | React | wok-ui |
|----------|-------|-------|--------|
| Reactive data | `ref()` / `reactive()` / `computed()` multiple choices | `useState()` / `useReducer()` / custom hooks | Modify properties directly, call `render()` |
| Conditional rendering | `v-if` / `v-show` / ternary expressions | `&&` / `?:` / early return | Callback function `add => { if (x) add(...) }` |
| Lifecycle | `onMounted` / `onUpdated` / `onUnmounted` | `useEffect` / `useLayoutEffect` | `mount()` / `destroy()` |

Vue 3's API count far exceeds Vue 2's, with Composition API, Options API, and compiler macros coexisting. When facing the same task, AI needs to "choose" which way to use. wok-ui has no such choice burden — **the only path is the correct path**.

#### 2. No Implicit Rules

Vue and React have many rules that "you must know but the framework won't tell you":

- React: Hooks cannot be called conditionally, dependency arrays must be complete, closure traps
- Vue: `v-model` modifier order, scoped slot parameter passing, destructuring limitations of reactive objects

These rules have numerous incorrect examples in training data. What AI learns is "common practices" rather than "correct practices". wok-ui has no implicit rules. All constraints are explicit, typed, and verifiable at runtime.

#### 3. High Token Efficiency

For the same functionality, wok-ui expresses it with fewer tokens:

```ts
// wok-ui: ~15 tokens
new Button({ text: 'Confirm', type: 'primary', onClick: submit })

// Vue 3: ~40 tokens (template + script + imports)
<template>
  <button class="btn-primary" @click="submit">Confirm</button>
</template>
<script setup>
import { defineEmits } from 'vue'
const emit = defineEmits(['submit'])
</script>

// React: ~35 tokens (JSX + hooks + types)
function ConfirmButton({ onSubmit }: { onSubmit: () => void }) {
  return <button className="btn-primary" onClick={onSubmit}>Confirm</button>
}
```

Less code means:
- Faster AI generation
- Context window can accommodate more business logic
- Fewer tokens consumed when fixing errors

#### 4. Intuitive and Fixable Errors

When AI generates errors:

| Framework | Typical Error | Fix Difficulty |
|-----------|---------------|----------------|
| Vue 3 | Forgetting `.value`, losing reactivity, lifecycle timing | Requires understanding reactivity principles |
| React | Incomplete hook dependencies, stale closures, infinite renders | Requires understanding hooks mechanism |
| wok-ui | Forgetting `render()`, module reuse | Explicit omission, just add it |

wok-ui errors don't require understanding framework internals, because the framework has no internals — code is behavior.

### Applicable Scenarios

wok-ui is particularly suitable for the following AI-assisted programming scenarios:

- **Rapid prototyping**: AI generates large amounts of CRUD pages, wok-ui's concise API makes generation quality more stable
- **Internal management systems**: Forms, tables, and dialogs are the core, directly covered by wok-ui's built-in modules
- **Low-code/no-code platforms**: The literal DOM construction approach is naturally suitable for visual configuration-to-code conversion
- **AI code assistant integration**: As a "recommended framework" in the knowledge base, reducing AI's decision points and error rates

### Summary

wok-ui is not a replacement for Vue or React, but a **better choice for specific scenarios**. When you need:

- Fast delivery rather than long-term maintenance
- AI-generated code rather than manual fine-tuning
- Deterministic behavior rather than flexible abstraction
- Low cognitive burden rather than a rich ecosystem

wok-ui's pragmatic design will be an efficient tool.
