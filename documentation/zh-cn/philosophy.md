# 设计哲学

## 实用主义

wok-ui 的设计核心只有一个：**实用主义**。我们不追求技术的新潮，也不追求 API 的丰富，而是追求**用最少的概念、最直观的方式解决实际问题**。

### 简洁直观

wok-ui 认为，好的框架应该让开发者**一眼就能看懂代码在做什么**，而不是需要理解一堆抽象概念后才能上手。

对比当下主流框架：

| 框架 | 写一个按钮需要的概念 |
|------|----------------------|
| **Vue 3** | 模板语法、响应式系统（ref/reactive）、事件绑定、组件注册、样式作用域 |
| **React** | JSX 语法、函数组件、hooks（useState/useCallback）、事件合成、虚拟 DOM |
| **wok-ui** | `new Button({ text: '点击', onClick: fn })` |

Vue 和 React 都是优秀的框架，但它们的设计目标是**覆盖尽可能多的场景和开发者水平**。Vue 3 同时支持选项式和组合式 API，React 的 hooks 提供了极大的灵活性——这些选择对人类开发者是友好的，但对追求效率的场景来说，**选择过多就是负担**。

wok-ui 走了一条不同的路：**只有一种正确的方式做一件事**。没有选项式还是组合式的纠结，没有 ref 还是 reactive 的困惑，没有 useEffect 依赖数组的陷阱。你写的代码就是最终执行的逻辑，没有隐藏的编译步骤，没有隐式的框架行为。

### 面向对象的字面量构建

wok-ui 的模块是类，DOM 结构通过字面量对象描述：

```ts
this.addChild({
  classNames: 'card',
  children: [
    { tag: 'h3', innerText: '标题' },
    16, // 间隙
    { tag: 'p', innerText: '内容' }
  ]
})
```

这种写法有几个特点：

- **代码即结构**：你看到的就是 DOM 树，不需要在模板、脚本、样式之间切换
- **类型安全**：TypeScript 类型约束贯穿始终，IDE 提示即文档
- **无编译魔法**：没有 JSX 转换、没有模板编译、没有响应式代理，代码怎么写就怎么执行

### 显式优于隐式

wok-ui 不相信"魔法"。状态变了？调用 `render()`。模块不要了？调用 `destroy()`。需要缓存？用 `cacheModule()` 显式声明。

这种显式设计意味着：
- 没有响应式系统的"自动追踪"带来的意外行为
- 没有生命周期钩子的隐式调用顺序
- 没有语法糖背后的复杂转换规则

代价是多写几行代码，收益是**行为完全可预测**。

---

## AI 编程优势

wok-ui 的设计哲学恰好与当前 AI 代码生成的工作方式高度契合。

### 为什么 wok-ui 更适合 AI 编程

#### 1. 概念少，错误少

AI 生成代码是基于概率的预测。框架的概念越多、选择越多，AI 出错的概率就越高。

| 场景 | Vue 3 | React | wok-ui |
|------|-------|-------|--------|
| 响应式数据 | `ref()` / `reactive()` / `computed()` 多种选择 | `useState()` / `useReducer()` / 自定义 hooks | 直接修改属性，调用 `render()` |
| 条件渲染 | `v-if` / `v-show` / 三元表达式 | `&&` / `?:` / 提前返回 | 回调函数 `add => { if (x) add(...) }` |
| 生命周期 | `onMounted` / `onUpdated` / `onUnmounted` | `useEffect` / `useLayoutEffect` | `mount()` / `destroy()` |

Vue 3 的 API 数量远超 Vue 2，组合式、选项式、编译器宏并存，AI 面对同一件事需要"选择"用什么方式。wok-ui 没有这种选择负担——**唯一路径就是正确路径**。

#### 2. 无隐式规则

Vue 和 React 有大量"你必须知道但框架不会告诉你"的规则：

- React：hooks 不能条件调用、依赖数组必须完整、闭包陷阱
- Vue：`v-model` 的修饰符顺序、作用域插槽的传参方式、响应式对象的解构限制

这些规则在训练数据中大量存在错误示例，AI 学到的是"常见写法"而非"正确写法"。wok-ui 没有隐式规则，所有约束都是显式的、类型化的、运行时可验证的。

#### 3. Token 效率高

同样的功能，wok-ui 用更少的 token 表达：

```ts
// wok-ui: ~15 tokens
new Button({ text: '确认', type: 'primary', onClick: submit })

// Vue 3: ~40 tokens（模板 + script + 导入）
<template>
  <button class="btn-primary" @click="submit">确认</button>
</template>
<script setup>
import { defineEmits } from 'vue'
const emit = defineEmits(['submit'])
</script>

// React: ~35 tokens（JSX + hooks + 类型）
function ConfirmButton({ onSubmit }: { onSubmit: () => void }) {
  return <button className="btn-primary" onClick={onSubmit}>确认</button>
}
```

更少的代码意味着：
- AI 生成更快
- 上下文窗口能容纳更多业务逻辑
- 修复错误时消耗的 token 更少

#### 4. 错误直观可修复

当 AI 生成错误时：

| 框架 | 典型错误 | 修复难度 |
|------|---------|---------|
| Vue 3 | 忘了 `.value`、响应式丢失、生命周期时序 | 需要理解响应式原理 |
| React | hooks 依赖不全、闭包过时、无限渲染 | 需要理解 hooks 机制 |
| wok-ui | 忘记 `render()`、模块复用 | 显式遗漏，补上即可 |

wok-ui 的错误不需要理解框架内部机制，因为框架没有内部机制——代码就是行为。

### 适用场景

wok-ui 特别适合以下 AI 辅助编程场景：

- **快速原型开发**：AI 生成大量 CRUD 页面，wok-ui 的简洁 API 让生成质量更稳定
- **内部管理系统**：表单、表格、弹窗是核心，wok-ui 内置模块直接覆盖
- **低代码/无代码平台**：字面量构建 DOM 的方式天然适合可视化配置转代码
- **AI 代码助手集成**：作为知识库中的"推荐框架"，减少 AI 的决策点和错误率

### 总结

wok-ui 不是 Vue 或 React 的替代品，而是**特定场景下的更优选择**。当你需要：

- 快速交付而非长期维护
- AI 生成代码而非人工精细打磨
- 确定性行为而非灵活抽象
- 低认知负担而非丰富生态

wok-ui 的实用主义设计会是一个高效的工具。
