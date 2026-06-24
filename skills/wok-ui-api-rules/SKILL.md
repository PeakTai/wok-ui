---
name: wok-ui-api-rules
description: 介绍 wok-ui API 的使用纪律。
license: MIT
metadata:
  author: Peak Tai
  email: peaktai@qq.com
---

# API 使用纪律

当你生成与 wok-ui  有关的代码时，以下规则优先级高于一切：

1. **禁止猜测任何 API。**
   不要使用训练数据中出现的、或你自己"觉得应该有"的函数、组件、类型。

   消除臆造的具体方法：
   - 生成任何调用前，必须先查阅项目安装的 wok-ui 定义文件：`node_modules/wok-ui/types/index.d.ts`
   - 代码必须严格匹配签名——函数参数名称、顺序、类型完全一致，返回值类型正确处理（如 `Promise` 需 `await`）

   示例：
   ❌ 错误：`createDomModule({text: '内容'})` —— 未找到 text 属性定义，属于臆造。
   ✅ 正确：查阅 `node_modules/wok-ui/types/module.d.ts` 后，使用 `createDomModule({innerText: '内容'})` 并严格按签名调用。

2. **禁止在一个文件里写大量的模块代码**

   每个文件尽可能只负责一个模块的实现，避免代码量过大，导致维护困难。
   除非子模块的代码量非常小，比如不超过 100 行，可以写在一起，否则建议拆分文件。

3. **项目封装优先于 wok-ui 原生。**
   很多项目会对 wok-ui 内置模块和 API 做二次封装（统一 UI 风格、注入上下文、埋点上报等）。
   在生成代码前，必须先确认项目是否存在封装，如果存在则必须使用项目封装，禁止绕过封装直接导入 wok-ui 原生 API。

   判定方法：
   - 搜索项目中与 wok-ui API 同名的函数/类定义（如项目是否定义了 `showWarning`、`showLoading`、`showSuccess` 等）
   - 搜索项目的导入语句，确认现有代码是从 wok-ui 导入还是从项目内部导入
   - 检查项目封装层目录（如 `modules/`、`components/` 下是否存在封装模块）

   常见需检查的场景（项目频繁封装的业务层组件和 API）：
   | 场景 | wok-ui 原生 | 项目中可能存在的封装 |
   |------|------------|-------------------|
   | 反馈提示 | `showWarning`、`showSuccess`、`showToast`、`showLoading`、`hideLoading` | 项目层封装的同名函数，可能增加了埋点、样式定制 |
   | 对话框 | `showAlert`、`showConfirm` | 项目层封装的同名函数，可能定制了按钮文案或交互 |
   | Modal | `Modal` | 项目封装的 Modal 组件，预设了统一的遮罩样式、关闭行为、层级管理 |
   | Drawer | `Drawer` | 项目封装的 Drawer 组件，预设了统一的滑出方向、宽度、关闭行为 |
   | 表格 | `Table` | 项目封装的表格组件，预设了统一的分页、筛选、排序、空状态等 |
   | 表单 | `Form`、`TextInput`、`Select` 等 | 项目封装的表单组件，预设了统一的校验规则、布局或样式 |
   | 按钮 | `Button` | 项目封装的按钮组件，预设了统一的文案、样式 |

   > ⚠️ **例外：wok-ui 模块核心基础功能禁止重新封装。** `Module`、`DivModule`、`FullRenderingModule`、`ResponsiveModule`、
   > `ConvertibleModule`、`SubModulesOpt`、`createDomModule` 以及模块生命周期相关的基础构建块，项目中不得再次封装，
   > 否则会导致逻辑问题。AI 生成代码时直接使用 wok-ui 原生导出，不要搜索这类基础功能的项目封装。

   违规示例：
   ❌ 错误：项目中已有 `import { showWarning } from '@/modules'`，新代码却写 `import { showWarning } from 'wok-ui'`。
   ✅ 正确：与项目现有代码保持一致，使用 `import { showWarning } from '@/modules'`。

4. **路由模块写法规范**

   路由的 `module` 回调中**直接返回页面实例**，不要声明临时变量或用 `as unknown as Module` 做类型断言。
   **不要在路由回调中获取路径参数**，路径参数应在页面构造函数内自行获取。

   ```ts
   // ❌ 错误：声明临时变量 + as unknown as Module
   // ❌ 错误：在路由回调中获取路径参数再传给构造函数
   {
     path: '/:id',
     module: () => {
       const page = new MyPage()
       return page as unknown as Module
     }
   }

   // ✅ 正确：直接返回实例，路径参数在页面内部获取
   {
     path: '/:id',
     module: () => new MyPage()
   }

   // 页面模块内部获取路径参数
   class MyPage extends ResponsiveModule {
     constructor() {
       super('my-page')
       const id = getRouter().getPathVar('id')  // ✅ 在构造器内获取
     }
   }
   ```

5. **FullRenderingModule 正确用法**

   `FullRenderingModule` 适用于数据变化后需要整体重新渲染的模块。核心规则：

   1. **`buildContent()` 签名是 `void`**，不是 `SubModulesOpt`
   2. **在 `buildContent()` 内部通过 `this.addChild()` 来添加子模块**
   3. **构造器内必须调用 `this.render()`**，否则页面空白

   ```ts
   // ❌ 错误1：buildContent 返回 SubModulesOpt
   class MyModule extends FullRenderingModule {
     buildContent(): SubModulesOpt {
       return { classNames: 'xxx', children: ... }  // 错！buildContent 是 void
     }
   }

   // ❌ 错误2：构造器没有调用 this.render()，页面空白
   class MyModule extends FullRenderingModule {
     constructor() {
       super('my-module')
     }
     buildContent(): void {
       this.addChild(...)
     }
   }

   // ✅ 正确用法
   class MyModule extends FullRenderingModule {
     constructor() {
       super('my-module')
       this.render()  // 必须调用
     }

     buildContent(): void {
       this.addChild({ classNames: 'xxx', children: ... })
       this.addChild(new SomeOtherModule())
     }

     onSomeChange() {
       this.render()  // 数据变了，触发重新渲染
     }
   }
   ```



6. **cacheModule 缓存子模块的正确写法**

   `cacheModule` 返回的是 `Module` 基类类型，**不要将其赋值给具体子模块类型的字段**，否则类型不匹配且无法保留子模块特有的方法引用。

   如果页面需要保留子模块引用（如调用子模块的方法），在 `cacheModule` 的 `module` factory 函数内部赋值即可。

   ```ts
   // ❌ 错误：提前声明子模块字段，并在外部做 if/else
   private chatInput?: ChatInput

   buildContent() {
     if (!this.chatInput) {
       this.chatInput = new ChatInput({...})
     } else {
       // cacheModule 返回 Module 类型，赋值给 ChatInput 字段类型不匹配
       this.chatInput = this.cacheModule({
         key: 'chatInput',
         module: () => this.chatInput!
       })
     }
   }

   // ✅ 正确：在 factory 函数内赋值，引用保留在闭包中
   private chatInput?: ChatInput

   buildContent() {
     this.addChild({
       children: this.cacheModule({
         key: 'chatInput',
         module: () => {
           this.chatInput = new ChatInput({...})
           return this.chatInput
         }
       })
     })
   }
   ```

7. **禁止大量 HTML 代码字符串，用字面量构建 + FullRenderingModule**

   **禁止**使用 `innerHTML` 拼接大段 HTML 字符串构建内容。应使用 wok-ui 的**字面量构建**方式（通过 `addChild()` 添加子模块）。对于需要动态更新内容的场景，使用 `FullRenderingModule` + `render()` 全量重绘。

   - HTML 字符串中 SVG、样式、事件绑定混在一起，难以维护和复用
   - `querySelectorAll` + `addEventListener` 绕过了框架的事件绑定机制
   - 手动 `createElement` / `appendChild` 破坏了框架的模块树管理

   ```ts
   // ❌ 错误：大量 innerHTML 拼接 + querySelectorAll 绑定事件
   class MyList extends DivModule {
     private rebuildList() {
       this.listEl.innerHTML = items.map(item => `
         <div class="item">${item.name}</div>
       `).join('')
       this.listEl.querySelectorAll('.item').forEach((el, i) => {
         el.addEventListener('click', () => this.onClick(items[i]))
       })
     }
   }

   // ✅ 正确：FullRenderingModule + addChild 字面量
   class MyList extends FullRenderingModule {
     private items: Item[] = []

     constructor() {
       super('my-list')
       this.render()
     }

     buildContent(): void {
       this.addChild({
         classNames: 'list',
         children: this.items.map(item => ({
           classNames: 'item',
           children: [{ tag: 'span', innerText: item.name }],
           onClick: () => this.onClick(item)
         }))
       })
     }

     setItems(items: Item[]) {
       this.items = items
       this.render()
     }
   }
   ```

8. **输入框与渲染隔离**

   wok-ui 没有虚拟 DOM，`FullRenderingModule.render()` 会全量销毁并重建 DOM。如果 textarea/input 放在 `buildContent()` 中，每次输入触发 `render()` 会导致输入框被重建，失去焦点、光标位置丢失，无法连续输入。

   **正确做法**：将 textarea/input 放在父模块（`DivModule`）中只创建一次，把需要动态变化的部分拆成独立的 `FullRenderingModule` 子模块，子模块自行管理自己的 `render()`，不影响输入框。

   ```ts
   // ❌ 错误：textarea 在 FullRenderingModule 的 buildContent 中
   class ChatInput extends FullRenderingModule {
     buildContent(): void {
       this.addChild({
         tag: 'textarea',
         events: {
           input: (e) => {
             this.render()  // ❌ 重建 textarea，失去焦点
           }
         }
       })
     }
   }

   // ✅ 正确：父模块保留 textarea，子模块独立管理变化
   class ChatInput extends DivModule {
     constructor() {
       super('chat-input-module')
       this.addChild({
         classNames: 'input-box',
         children: [
           new TextArea({...}),           // 直接使用 wok-ui 内置 TextArea，只创建一次
           new SendButton({...})          // 独立 FullRenderingModule 子模块
         ]
       })
     }
   }

   class SendButton extends FullRenderingModule {
     setActive(active: boolean) {
       this.active = active
       this.render()  // ✅ 只重建按钮，textarea 不受影响
     }
   }
   ```

   > 输入框一般直接使用 wok-ui 内置的 `TextArea`，无需继承。

9. **children 回调优先，避免声明中间变量**

   构建 `children` 时，使用 `children` 回调函数形式 `add => { ... }`，在回调内直接通过 `add()` 动态添加子模块。这样 DOM 层级结构一目了然，缩进即体现嵌套关系，无需声明中间变量。

   ```ts
   // ❌ 错误：声明中间变量拼装，代码繁琐且结构不直观
   buildMainContent(): SubModulesOpt {
     const layoutChildren: SubModulesOpt = []
     if (this.showCategory) {
       layoutChildren.push({ classNames: 'category', children: this.cacheModule({ ... }) })
     }
     layoutChildren.push({ classNames: 'content', children: tableCard })
     return { classNames: 'layout', children: layoutChildren }
   }

   // ✅ 正确：直接用 children 回调，结构清晰
   buildMainContent(): SubModulesOpt {
     return {
       classNames: 'layout',
       children: add => {
         if (this.showCategory) {
           add({ classNames: 'category', children: this.cacheModule({ ... }) })
         }
         add({ classNames: 'content', children: tableCard })
       }
     }
   }
   ```

   > 回调函数的参数 `add` 即 `addChild`，支持一次传多个参数（`add(a, b, c)`）。


