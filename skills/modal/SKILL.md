---
name: modal
description: 介绍 wok-ui 模态框的使用方法，包括基本展示、全屏/静态背景/居中、自定义按钮、内嵌表单、句柄关闭、完全自定义内容等全部功能。
license: MIT
metadata:
  author: Peak Tai
  email: pektai@qq.com
---

# 模态框

通过 `showModal` 函数快速创建一个模态框，支持自定义标题、正文、按钮以及完全自定义内容。

> **源码位置**：安装 wok-ui 后，源码位于 `node_modules/wok-ui/lib/modal/index.ts`，样式位于 `node_modules/wok-ui/lib/modal/style.less`。也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。如果在 wok-ui 仓库本身，源码在 `lib/modal/` 目录下。

## 基本使用

```ts
import { showModal } from 'wok-ui'

showModal({
  title: '标题',
  width: 500,
  body: '正文内容'
})
```

`showModal` 返回一个包含 `close()` 方法的 `Modal` 对象，用于手动关闭模态框。

## 显示选项

### 全屏

```ts
showModal({
  title: '标题',
  fullscreen: true,
  body: '正文内容'
})
```

### 静态背景

`staticBackDrop: true` 禁止点击背景关闭，点击时模态框会抖动提示：

```ts
showModal({
  title: '标题',
  staticBackDrop: true,
  body: '无法点击背景关闭'
})
```

### 对话框居中

```ts
showModal({
  title: '标题',
  dialogCentered: true,
  body: '对话框垂直居中显示'
})
```

> `dialogCentered` 与 `fullscreen` 冲突，全屏选项优先。

### 圆角

```ts
showModal({
  body: '自定义圆角',
  borderRadius: 12
})
```

## 标题与关闭按钮

- 不传 `title` 则不显示标题栏
- `closeBtn: false` 隐藏关闭按钮（仅在 `title` 有值时生效）

```ts
showModal({
  title: '标题',
  closeBtn: false,
  body: '无关闭按钮，只能点击背景关闭',
  onClose: () => console.log('模态框已关闭')
})
```

## 自定义按钮

### 预设确认/取消按钮

```ts
showModal({
  title: '确认操作',
  body: '是否继续？',
  buttons: {
    confirm: '确认删除',
    cancel: true   // true 表示使用默认文字（i18n）
  },
  onConfirm() {
    console.log('用户点击了确认')
  }
  // 取消按钮自动关闭模态框，通过 onClose 监听
})
```

- `confirm`/`cancel` 值为 `boolean` 时使用默认 i18n 文字，值为 `string` 时使用自定义文字
- `onConfirm` 只有点击确认按钮时触发

### 完全自定义按钮数组

```ts
showModal({
  title: '操作',
  body: '请选择',
  buttons: [
    new Button({ text: '选项A', onClick: () => { /* ... */ } }),
    new Button({ text: '选项B', type: 'danger', onClick: () => { /* ... */ } })
  ]
})
```

> 自定义按钮从右往左排列。

## 自定义脚部

`footer` 优先级高于 `buttons`，可完全自定义脚部区域：

```ts
showModal({
  title: '标题',
  body: '正文',
  footer: { innerText: '自定义脚部内容', style: { color: 'grey' } }
})
```

## 内嵌表单

```ts
import { showModal, Form, TextInput, PasswordInput, rem } from 'wok-ui'

const formData = { account: '', pwd: '' }

const form = new Form({
  children: [
    new TextInput({ value: formData.account, placeholder: '请输入帐号', required: true }),
    rem(1),
    new PasswordInput({ value: formData.pwd, placeholder: '请输入密码', required: true })
  ],
  onSubmit: () => {
    login(formData)
      .then(() => modal.close())
      .catch(showWarning)
  }
})

const modal = showModal({
  title: '登录',
  body: form,
  buttons: { confirm: '登录', cancel: true },
  onConfirm() {
    form.submit() // 触发表单校验，通过后执行 onSubmit
  }
})
```

## 句柄关闭

通过 `showModal` 返回对象的 `close()` 方法关闭：

```ts
const modal = showModal({
  title: '标题',
  staticBackDrop: true,
  closeBtn: false,
  body: new Button({
    text: '点击关闭',
    onClick: () => modal.close()
  })
})
```

## 完全自定义内容

`replaceByBody: true` 让 body 替换整个模态框，不使用预设结构：

```ts
const modal = showModal({
  replaceByBody: true,
  staticBackDrop: true,
  body: {
    classNames: 'custom-modal',
    children: [
      '自定义内容区域',
      rem(1),
      new Button({ text: '关闭', onClick: () => modal.close() })
    ]
  }
})
```

## 关闭所有模态框

```ts
import { closeAllModals } from 'wok-ui'

await closeAllModals()
```

## 完整选项参考

| 选项             | 类型                                                         | 默认值  | 说明                                           |
| ---------------- | ------------------------------------------------------------ | ------- | ---------------------------------------------- |
| `title`          | `string`                                                     | -       | 标题，不传不显示标题栏                         |
| `body`           | `SubModulesOpt`                                              | 必填    | 正文内容                                       |
| `width`          | `number`                                                     | `500`   | 对话框宽度（px）                               |
| `fullscreen`     | `boolean`                                                    | `false` | 是否全屏                                       |
| `staticBackDrop` | `boolean`                                                    | `false` | 是否禁止点击背景关闭                           |
| `dialogCentered` | `boolean`                                                    | `false` | 是否垂直居中                                   |
| `closeBtn`       | `boolean`                                                    | `true`  | 是否显示关闭按钮（有标题时有效）               |
| `replaceByBody`  | `boolean`                                                    | `false` | 是否用 body 替换整个模态框内容                 |
| `borderRadius`   | `number`                                                     | -       | 自定义圆角（px）                               |
| `buttons`        | `{ confirm?, cancel? } \| Button[]`                          | -       | 脚部按钮                                       |
| `footer`         | `ConvertibleModule`                                          | -       | 自定义脚部，优先级高于 buttons                 |
| `onClose`        | `() => void`                                                 | -       | 关闭回调                                       |
| `onConfirm`      | `() => void`                                                 | -       | 确认按钮回调                                   |
| `onShown`        | `() => void`                                                 | -       | 入场动画完成后回调                             |

## 相关函数

| 函数              | 说明                 |
| ----------------- | -------------------- |
| `showModal(opts)` | 显示模态框，返回 `Modal`（含 `close()` 方法） |
| `closeAllModals()`| 关闭所有模态框       |
