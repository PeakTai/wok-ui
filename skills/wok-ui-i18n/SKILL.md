---
name: wok-ui-i18n
description: 介绍 wok-ui 国际化系统的使用方法，包括内置消息、自定义语言、语言切换、消息构建以及如何扩展项目专属国际化。
license: MIT
metadata:
  author: Peak Tai
  email: peaktai@qq.com
---

# 国际化

wok-ui 内置国际化系统，默认支持英文（`en-US`）和中文（`zh-CN`）。框架中的表单校验、弹窗按钮等文案均通过 i18n 系统管理，自动适配当前语言。如果需要支持其他语言或扩展项目自身的国际化文案，可通过 `getI18n()` 获取全局实例进行配置。

> **源码位置**：安装 wok-ui 后，i18n 模块的源码位于项目中的 `node_modules/wok-ui/lib/i18n/` 目录下。
> 主要文件：
> - `i18n.ts` — `I18n` 基类和 `ExtensibleI18n` 可扩展类
> - `message.ts` — `I18nMessages` 接口定义（内置消息 key 列表）
> - `en-US.ts` — 英文消息模板
> - `zh-cn.ts` — 中文消息模板
> - `tag.ts` — 语言标签解析工具
>
> 也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认 i18n 相关的导出接口。


## 获取 i18n 实例

调用 `getI18n()` 获取全局唯一的 `ExtensibleI18n` 实例，首次调用时会自动完成初始化：注册 `en-US` 和 `zh-CN` 两种语言，并根据浏览器语言偏好自动选择一种支持的语言。

```ts
import { getI18n } from 'wok-ui'

const i18n = getI18n()
// 此时 i18n 已初始化，默认语言为 en-US 或 zh-CN（取决于浏览器设置）
```

## 内置消息

wok-ui 内置了以下消息 key，用于框架内部组件（表单校验、弹窗等）：

| Key                         | 含义说明               |
| --------------------------- | ---------------------- |
| `cancel`                    | 取消                   |
| `confirm`                   | 确定                   |
| `information`               | 提示信息（弹窗标题）   |
| `confirmation`              | 请确认（确认框标题）   |
| `choose-file`               | 请选择文件             |
| `form-err-required`         | 必填校验失败           |
| `form-err-must-check`       | 必须勾选校验失败       |
| `form-err-number`           | 数字格式校验失败       |
| `form-err-min`              | 最小值校验失败         |
| `form-err-max`              | 最大值校验失败         |
| `form-err-max-select`       | 最多选择项数校验失败   |
| `form-err-min-select`       | 最少选择项数校验失败   |
| `form-err-max-length`       | 最大长度校验失败       |
| `form-err-min-length`       | 最小长度校验失败       |
| `form-err-min-size`         | 文件最小尺寸校验失败   |
| `form-err-max-size`         | 文件最大尺寸校验失败   |
| `form-err-max-files-select` | 最多选择文件数校验失败 |
| `form-err-min-files-select` | 最少选择文件数校验失败 |

通过 `buildMsg` 方法可以获取当前语言对应的文案：

```ts
const i18n = getI18n()
// 获取"确定"按钮文案
const confirmText = i18n.buildMsg('confirm')

// 带占位符的消息：form-err-min 的默认值为 "Not less than {}."
// buildMsg 会将占位符 {} 依次替换为传入的参数
const minErrMsg = i18n.buildMsg('form-err-min', '10')
// 中文环境下得到："不得小于 10"
```

## 添加新语言

通过 `setMsgs` 方法为一种语言注册消息模板。消息模板可以直接传入，也支持传入一个返回 Promise 的工厂函数来实现异步按需加载。

### 同步注册

消息模板直接在代码中定义，适合轻量级的多语言支持：

```ts
import { getI18n } from 'wok-ui'

const i18n = getI18n()

i18n.setMsgs('ja', {
  cancel: 'キャンセル',
  confirm: '確認',
  'choose-file': 'ファイルを選択してください',
  'form-err-required': 'この項目を入力してください',
  'form-err-must-check': 'この項目をチェックしてください',
  'form-err-number': '数字を入力してください',
  'form-err-min': '{} より小さい値を入力しないでください',
  'form-err-max': '{} より大きい値を入力しないでください',
  'form-err-max-select': '{} 個以内のオプションを選択してください',
  'form-err-min-select': '{} 個以上のオプションを選択してください',
  'form-err-max-length': '{} 文字以内で入力してください',
  'form-err-min-length': '{} 文字以上で入力してください',
  'form-err-min-size': 'ファイルのサイズは {} より小さくならないでください',
  'form-err-max-size': 'ファイルのサイズは {} より大きくならないでください',
  'form-err-max-files-select': '{} 個以内のファイルを選択してください',
  'form-err-min-files-select': '{} 個以上のファイルを選択してください',
  information: '情報',
  confirmation: '確認'
})
```

### 异步注册

传入一个返回 `Promise` 的工厂函数，在首次切换到该语言时才会加载，可减少打包体积：

```ts
i18n.setMsgs('ja', () => fetch('/wok-ui/i18n/ja.json').then(res => res.json()))
```

## 切换语言

调用 `setLang` 方法切换到指定语言。`setLang` 是异步方法，返回 `Promise<boolean>`：

- 返回 `true`：切换成功
- 返回 `false`：该语言未被注册（未调用过 `setMsgs`），不会改变当前语言

```ts
const i18n = getI18n()

// 切换到中文
const ok = await i18n.setLang('zh-CN')
console.log(ok) // true

// 切换到未注册的语言会失败
const fail = await i18n.setLang('fr')
console.log(fail) // false，语言未改变
```

> **重要**：务必在 `await i18n.setLang(...)` 完成之后再初始化页面，否则页面渲染时可能使用了错误的语言。尤其是设置了异步加载的语言时，`setLang` 会等待语言数据加载完成。

### 获取当前语言

```ts
const currentLang = i18n.getLang()
```

## 匹配浏览器语言

`getSupportedLanguageTags` 方法接收一组语言标签，返回其中能被 i18n 支持的语言列表。配合 `navigator.languages` 可实现自动匹配：

```ts
const i18n = getI18n()
const supported = i18n.getSupportedLanguageTags(...navigator.languages)
if (supported.length > 0) {
  await i18n.setLang(supported[0])
}
```

实际上 `getI18n()` 首次调用时已经内置了此逻辑，无需手动调用。

## 构建消息

`buildMsg` 方法根据当前语言，返回对应 key 的消息文案。支持占位符 `{}`，按参数顺序依次替换：

```ts
const i18n = getI18n()

// 不带占位符
i18n.buildMsg('cancel') // "取消" (zh-CN) 或 "cancel" (en-US)

// 带一个占位符
i18n.buildMsg('form-err-min', '5') // "不得小于 5"

// 带多个占位符（按顺序替换）
i18n.buildMsg('form-err-min-length', '3') // "请填写至少 3 个字符"
```

消息模板中占位符数量应与传入参数数量保持一致。

## 国际化扩展

项目自身通常也需要国际化，可以在 wok-ui 的 i18n 基础上扩展，做到项目与框架的语言保持一致。当切换语言时，扩展出的 i18n 对象也会同步切换。

### 步骤 1：定义扩展消息类型

```ts
interface ExtI18nMsgs {
  currentLanguage: string
  switchToCustomLanguage: string
  internationalization: string
}
```

### 步骤 2：初始化扩展 i18n

```ts
import { getI18n, I18n } from 'wok-ui'

let extI18n: I18n<ExtI18nMsgs> | undefined

export async function initI18n() {
  if (extI18n) {
    throw new Error('i18n 已初始化，请勿重复调用')
  }

  const i18n = getI18n()

  // (可选) 为基础库添加新的语言支持，异步加载
  i18n.setMsgs('tibt', () => fetch('/wok-ui/i18n/tibt.json').then(res => res.json()))

  // 加载扩展部分的默认英文消息
  const enUsMsgs = await fetch('/i18n/ext-en-us.json').then(res => res.json())
  // 通过 extend 方法创建扩展 i18n 对象
  extI18n = i18n.extend<ExtI18nMsgs>(enUsMsgs)

  // 为扩展 i18n 注册其他语言，同样可以异步加载
  extI18n.setMsgs('zh-CN', () => fetch('/i18n/ext-zh-cn.json').then(res => res.json()))
  extI18n.setMsgs('tibt', () => fetch('/i18n/ext-tibt.json').then(res => res.json()))

  // 根据浏览器语言自动切换
  const supportedLangs = i18n.getSupportedLanguageTags(...navigator.languages)
  if (supportedLangs.length > 0) {
    await i18n.setLang(supportedLangs[0])
  }
}

export function getExtI18n(): I18n<ExtI18nMsgs> {
  if (!extI18n) {
    throw new Error('请先调用 initI18n() 完成初始化')
  }
  return extI18n
}
```

### 步骤 3：使用扩展 i18n

```ts
const i18n = getExtI18n()
// 切换语言时，扩展 i18n 和基础 i18n 会同步切换
i18n.buildMsg('currentLanguage') // 当前语言的文案
```

### 完整初始化流程

应用启动时，按以下顺序完成 i18n 初始化：

```ts
import { initRouter } from 'wok-ui'
import { initI18n } from './i18n'

async function bootstrap() {
  // 1. 先完成 i18n 初始化
  await initI18n()
  // 2. 再初始化路由和页面
  initRouter({
    mode: 'hash',
    rules: [
      { path: '/', module: () => import('./pages/home').then(m => new m.HomePage()) }
    ]
  }).mount(document.body)
}

bootstrap()
```

> **关键原则**：`initI18n()` 中的 `await i18n.setLang(...)` 必须完成之后，才能渲染页面，否则页面可能以错误语言呈现。

## 核心 API 参考

### ExtensibleI18n<T> (通过 getI18n() 获取)

| 方法                            | 说明                                               |
| ------------------------------- | -------------------------------------------------- |
| `setMsgs(tag, msgs)`            | 注册一种语言的消息模板，支持同步或异步（工厂函数） |
| `setLang(tag): Promise<boolean>` | 切换当前语言，异步方法，需 await                   |
| `getLang(): string`             | 获取当前语言标签                                   |
| `buildMsg(key, ...args): string` | 根据当前语言构建消息文案，替换占位符               |
| `getSupportedLanguageTags(...tags): string[]` | 从语言列表中筛选出已注册的语言 |
| `extend<K>(enMsgs): I18n<K>`    | 扩展生成一个新的 I18n 对象，语言切换被同步         |

### I18n<K> (通过 extend 获得)

继承 `ExtensibleI18n` 除 `extend` 外的所有方法：`setMsgs`、`setLang`、`getLang`、`buildMsg`、`getSupportedLanguageTags`。

> **注意**：从 `extend` 获得的 `I18n<K>` 对象无法调用 `extend` 进行二次扩展。
