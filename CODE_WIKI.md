# wok-ui Code Wiki

## 项目概述

**wok-ui** 是一个轻量级前端 UI 组件库，具有以下特点：

- **无第三方依赖** - 纯粹原生实现，体积小
- **响应式设计** - 适配各种屏幕尺寸
- **强类型支持** - 基于 TypeScript，完整的类型约束
- **面向对象** - 模块化设计，易于理解和扩展

## 项目结构

```
wok-ui/
├── lib/                    # 核心源代码
│   ├── animation/          # 动画模块
│   ├── button/             # 按钮组件
│   ├── drawer/             # 抽屉组件
│   ├── dropdown/           # 下拉菜单
│   ├── form/               # 表单组件
│   ├── heading/            # 标题组件
│   ├── i18n/               # 国际化
│   ├── icon/               # 图标组件
│   ├── layout/             # 布局组件
│   ├── link/               # 链接组件
│   ├── message/            # 消息提示
│   ├── modal/              # 模态框
│   ├── render/             # 渲染工具
│   ├── router/             # 路由模块
│   ├── table/              # 表格组件
│   ├── utils/              # 工具函数
│   ├── color.ts            # 颜色管理
│   ├── index.ts            # 主入口
│   ├── module.ts           # 模块基类
│   ├── size.ts             # 尺寸管理
│   ├── spacer.ts           # 间距组件
│   └── text.ts             # 文本组件
├── types/                  # TypeScript类型定义
├── dist/                   # 构建产物
├── docs/                   # 文档预览
├── documentation/          # 文档源文件
└── test/                   # 测试代码
```

## 核心架构

### 模块系统

wok-ui 的核心是模块系统，所有组件都继承自 `Module` 基类。

#### Module 基类 [lib/module.ts](file:///workspace/lib/module.ts)

**核心职责**：
- DOM 元素封装和管理
- 子模块树结构维护
- 生命周期管理（挂载、销毁）
- 事件处理

**关键方法**：

| 方法 | 功能 |
|------|------|
| `mount(parentEl)` | 将模块挂载到指定 DOM 元素 |
| `destroy()` | 销毁模块及其所有子模块 |
| `addChild(...children)` | 添加子模块 |
| `removeChild(moduleOrIndex)` | 移除子模块 |
| `replaceBy(module)` | 替换当前模块 |
| `getChildren()` | 获取所有子模块 |
| `find(predicate)` | 递归查找子模块 |
| `scrollIntoView(options)` | 滚动使元素可见 |

**类型转换**：

```typescript
// 支持多种类型转换为模块
type ConvertibleModule = 
  | string           // 转为文本节点
  | number           // 转为指定高度的空白块
  | Module           // 直接使用
  | HTMLElement      // 封装为 DomModule
  | (() => Module)   // 延迟执行函数
  | CreateDomModuleOptions  // DOM 配置对象
```

#### DivModule

`DivModule` 是最基础的容器模块，继承自 `Module`，内部使用 `<div>` 元素。

```typescript
class Page extends DivModule {
  constructor() {
    super()
    this.addChild(new Text('Hello World'))
  }
}
new Page().mount(document.body)
```

## 主要模块详解

### 1. 布局模块 [lib/layout/](file:///workspace/lib/layout/)

| 组件 | 功能 | 说明 |
|------|------|------|
| `HBox` | 水平盒子 | 子元素从左往右排布，支持换行 |
| `VBox` | 垂直盒子 | 子元素从上往下堆叠 |
| `Grid` | 网格布局 | 二维网格系统 |
| `JustifyBox` | 对齐盒子 | 灵活的对齐控制 |
| `SplitBox` | 分割盒子 | 可拖拽调整大小 |

#### HBox 示例

```typescript
new HBox({
  gap: 10,                    // 子元素间距
  children: [btn1, btn2],     // 子模块
  wrap: true,                 // 是否换行
  reverse: false,             // 是否反转顺序
  align: 'center'             // 垂直对齐
})
```

#### VBox 示例

```typescript
new VBox({
  gap: 8,
  children: [input, button],
  align: 'center'             // 水平对齐: left/center/right/stretch
})
```

### 2. 表单模块 [lib/form/](file:///workspace/lib/form/)

#### 输入组件

| 组件 | 文件 | 功能 |
|------|------|------|
| `TextInput` | input/text.ts | 文本输入 |
| `PasswordInput` | input/password.ts | 密码输入 |
| `NumberInput` | input/number.ts | 数字输入 |
| `TextareaInput` | input/textarea.ts | 多行文本 |
| `SelectInput` | select/ | 下拉选择 |
| `ColorInput` | input/color.ts | 颜色选择 |
| `DateInput` | input/date.ts | 日期选择 |
| `FileInput` | input/file.ts | 文件上传 |
| `SearchInput` | input/search.ts | 搜索输入 |
| `TelInput` | input/tel.ts | 电话输入 |

#### 选择组件

| 组件 | 文件 | 功能 |
|------|------|------|
| `Checkbox` | checkbox/checkbox.ts | 复选框 |
| `BoolCheckbox` | checkbox/bool-checkbox.ts | 布尔开关 |
| `CheckboxGroup` | checkbox/checkbox-group.ts | 复选框组 |
| `Radio` | radio/radio.ts | 单选框 |
| `RadioGroup` | radio/radio-group.ts | 单选框组 |
| `RangeInput` | range/ | 滑块输入 |

### 3. 按钮组件 [lib/button/index.ts](file:///workspace/lib/button/index.ts)

**ButtonOpts 配置**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `text` | string | 按钮文本 |
| `type` | 'primary'\|'success'\|'danger'\|'warning'\|'default' | 按钮类型 |
| `outline` | boolean | 是否描边样式 |
| `block` | boolean | 是否块级显示 |
| `disabled` | boolean | 是否禁用 |
| `size` | 'sm'\|'default'\|'lg' | 尺寸 |
| `width` | number | 指定宽度 |
| `icon` | SvgIcon\|RemoteSvgIcon | 图标 |
| `iconPosition` | 'start'\|'end' | 图标位置 |
| `onClick` | (ev: MouseEvent) => void | 点击事件 |

**示例**：

```typescript
new Button({
  text: '提交',
  type: 'primary',
  size: 'lg',
  onClick: () => console.log('clicked')
})
```

### 4. 颜色管理 [lib/color.ts](file:///workspace/lib/color.ts)

**Color 接口**：

```typescript
interface Color {
  primary: string      // 主题色
  danger: string       // 危险色
  success: string      // 成功色
  warning: string      // 警告色
  border: string       // 边框色
  text: string         // 主文本色
  textSecondary: string // 次要文本色
  outline: string      // 描边色
}
```

**默认值**：
- primary: `#1677ff`
- danger: `#ff4d4f`
- success: `#198754`
- warning: `#ffc107`

**API**：

| 函数 | 功能 |
|------|------|
| `getColor()` | 获取当前颜色配置 |
| `setColor(color)` | 设置自定义颜色 |
| `resetColor()` | 重置为默认颜色 |
| `resolveColor(key)` | 根据键获取颜色值 |

### 5. 路由模块 [lib/router/](file:///workspace/lib/router/)

**路由配置**：

```typescript
const router = initRouter({
  mode: 'hash',                    // 'hash' | 'history'
  base: '/app',                    // history模式的基础路径
  rules: [
    { path: '/', module: () => new HomePage() },
    { path: '/about', module: () => new AboutPage() },
    { path: '/user/:id', module: (params) => new UserPage(params) }
  ],
  fallback: () => new NotFoundPage()  // 404处理
})

router.mount(document.body)
```

**路由API**：

| 函数/方法 | 功能 |
|-----------|------|
| `initRouter(opts)` | 初始化路由（单例） |
| `getRouter()` | 获取路由实例 |
| `push(path)` | 导航到指定路径 |
| `replace(path)` | 替换当前历史记录 |
| `go(n)` | 前进/后退 |
| `back()` | 返回上一页 |

### 6. 国际化 [lib/i18n/](file:///workspace/lib/i18n/)

**支持语言**：
- 中文 (zh-CN)
- 英文 (en-US)
- 日文 (ja)

**API**：

```typescript
const i18n = getI18n()
i18n.setLang('zh-CN')           // 设置语言
i18n.t('form.required')         // 翻译
i18n.setMsgs('custom', {...})   // 扩展消息
```

### 7. 消息提示 [lib/message/](file:///workspace/lib/message/)

| 组件 | 功能 |
|------|------|
| `Dialog` | 对话框 |
| `Toast` | 轻提示 |
| `Loading` | 加载指示器 |

**Dialog 示例**：

```typescript
Dialog.info({
  title: '提示',
  message: '操作成功',
  onConfirm: () => console.log('confirmed')
})

Dialog.confirm({
  title: '确认',
  message: '确定要删除吗？',
  onConfirm: () => deleteItem(),
  onCancel: () => console.log('cancelled')
})
```

**Toast 示例**：

```typescript
Toast.success('操作成功')
Toast.error('操作失败')
Toast.info('提示信息')
Toast.warning('警告信息')
```

### 8. 图标模块 [lib/icon/](file:///workspace/lib/icon/)

**SvgIcon** - 内联 SVG 图标

```typescript
new SvgIcon({
  content: '<svg>...</svg>',
  size: 24,
  color: '#1677ff'
})
```

**RemoteSvgIcon** - 远程 SVG 图标

```typescript
new RemoteSvgIcon({
  url: '/icons/alarm.svg',
  size: 24
})
```

### 9. 动画模块 [lib/animation/](file:///workspace/lib/animation/)

**支持动画类型**：
- fade - 淡入淡出
- slide-left/right/top/bottom - 滑动
- scale-up/scale-down - 缩放
- shake - 抖动

## 样式系统

### CSS 变量

wok-ui 使用 CSS 变量实现主题定制：

```css
--color-primary: #1677ff;
--color-danger: #ff4d4f;
--color-success: #198754;
--color-warning: #ffc107;
--color-border: #dee2e6;
--color-text: #303133;
--color-text-secondary: #757575;
--color-outline: #b1d2ff;
```

### 响应式设计

通过 `Responsive` 组件实现响应式布局：

```typescript
new Responsive({
  children: [
    { breakpoint: 'sm', module: () => new MobileLayout() },
    { breakpoint: 'md', module: () => new TabletLayout() },
    { breakpoint: 'lg', module: () => new DesktopLayout() }
  ]
})
```

## 项目运行

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm run dev
```

### 构建生产版本

```bash
pnpm run build
```

### 构建文档

```bash
pnpm run build-docs
```

### 运行测试服务器

```bash
pnpm run test
```

## 使用示例

### 基础用法

```typescript
import 'wok-ui/dist/style.css'
import { DivModule, Text, Button, VBox } from 'wok-ui'

class App extends DivModule {
  constructor() {
    super()
    this.addChild(new VBox({
      gap: 16,
      align: 'center',
      children: [
        new Text('Hello wok-ui !'),
        new Button({
          text: '点击我',
          type: 'primary',
          onClick: () => alert('Hello!')
        })
      ]
    }))
  }
}

new App().mount(document.body)
```

### 路由用法

```typescript
import 'wok-ui/dist/style.css'
import { DivModule, Text, Button, initRouter, RouterLink } from 'wok-ui'

class HomePage extends DivModule {
  constructor() {
    super()
    this.addChild(new Text('首页'))
    this.addChild(new RouterLink({
      text: '关于',
      to: '/about'
    }))
  }
}

class AboutPage extends DivModule {
  constructor() {
    super()
    this.addChild(new Text('关于我们'))
  }
}

initRouter({
  mode: 'hash',
  rules: [
    { path: '/', module: () => new HomePage() },
    { path: '/about', module: () => new AboutPage() }
  ]
}).mount(document.body)
```

## 设计理念

1. **保持简单** - 不追求大而全，只实现必要的基础功能
2. **面向对象** - 易于理解，方便封装和抽象
3. **模块化** - 职责单一，利于复杂业务拆分
4. **不兼容老旧浏览器** - 专注现代浏览器特性

## 优缺点分析

**优点**：
- 学习成本低，接近于裸 DOM
- 强类型推断，开发更高效
- 体积小，无第三方依赖
- 性能较好，无虚拟层开销

**缺点**：
- 不支持数据同步视图，需要手动管理渲染
- 无 DOM 差异化渲染，全量渲染有时效果不理想
- 可能有较深的嵌套层级
- CSS 类名是语义化的，与其他框架混用可能冲突

## 许可证

MIT License