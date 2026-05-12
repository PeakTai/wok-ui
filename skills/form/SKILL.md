---
name: form
description: 介绍 wok-ui 表单系统的使用方法，包括 Form 表单容器、内置表单输入模块的概览、表单校验与提交流程，以及如何自定义扩展表单元素。
license: MIT
metadata:
  author: Peak Tai
  email: peaktai@qq.com
---

# 表单

wok-ui 提供了一整套表单模块，覆盖了常用的输入元素，并且支持自定义扩展。表单系统围绕 `Form` 容器和 `FormInput` 抽象类构建，内置校验反馈机制和多语言支持。

> **源码位置**：安装 wok-ui 后，表单模块的源码位于项目中的 `node_modules/wok-ui/lib/form/` 目录下。
> 主要文件：
> - `form.ts` — `Form` 容器类及 `FormOpts` 接口
> - `form-input.ts` — `FormInput` 抽象基类
> - `invalid-feedback.ts` — 校验反馈信息模块
> - `input/` — 各类文本输入框（TextInput、NumberInput、DateInput 等）
> - `checkbox/` — 多选框相关（CheckboxGroup、BoolCheckbox）
> - `radio/` — 单选框相关（RadioGroup）
> - `select/` — 下拉选择框
> - `range/` — 滑动条
>
> 也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认表单相关的导出接口。
>
> 如果当前处于 wok-ui 仓库本身，源码可直接在 `lib/form/` 目录下查看。
>
> 内置表单元素的具体使用请参阅：[内置表单元素](references/form-inputs.md)
> 自定义表单元素扩展请参阅：[自定义表单元素](references/custom-form-input.md)

## 基本使用

通过构建 `Form` 实例创建表单，`children` 中可以放入任意模块，但只有实现了 `FormInput` 类型的模块才会被当作表单元素参与校验。

```ts
import { Form, TextInput, RadioGroup, Button, rem } from 'wok-ui'

const formData = {
  name: 'Jack',
  gender: '男'
}

new Form({
  children: [
    '姓名：',
    rem(0.5),
    new TextInput({
      value: formData.name,
      required: true,
      minLength: 2,
      maxLength: 32,
      onChange(val) {
        formData.name = val
      }
    }),
    rem(1),
    '性别：',
    rem(0.5),
    new RadioGroup({
      value: formData.gender,
      options: [
        { label: '男', value: '男' },
        { label: '女', value: '女' },
        { label: '保密', value: '保密' }
      ],
      onChange(val) {
        formData.gender = val
      }
    }),
    rem(1),
    new Button({
      formType: 'submit',
      text: '提交修改',
      type: 'primary'
    })
  ],
  onSubmit: () => {
    // 所有表单元素校验通过后触发
    console.log('提交数据:', formData)
  }
}).mount(document.body)
```

> **注意**：Form 不会自动绑定数据，需要在每个表单元素的 `onChange` 回调中自行处理数据的读写。这样设计是为了更灵活地应对各类复杂需求。

## 表单提交

表单提交有两个关键方法：

### submit()

触发提交，会先校验所有 `FormInput` 子模块。如果全部校验通过，则调用 `onSubmit` 回调；如果有校验失败的输入项，会自动滚动到第一个失败项（如果是 `TextInput` 还会自动聚焦），不会触发 `onSubmit`。

```ts
new Form({
  children: [ /* ... */ ],
  onSubmit: () => {
    // 只有全部校验通过才会执行
  }
})
```

通过 `Button` 的 `formType: 'submit'`，可以让按钮点击时自动触发表单提交：

```ts
new Button({ text: '提交', type: 'primary', formType: 'submit' })
```

### validate()

仅校验所有表单元素，不触发提交事件，返回 `boolean` 表示是否全部通过：

```ts
const form = new Form({ children: [ /* ... */ ] })
if (form.validate()) {
  console.log('全部校验通过')
}
```

## 校验反馈模式

通过 `feedbackMode` 选项设置校验失败时的反馈信息展示方式：

```ts
// 内联模式（默认）：反馈信息显示在输入框下方
new Form({ children: [/* ... */], feedbackMode: 'inline' })

// 悬浮提示模式：反馈信息以 tooltip 形式展示在输入框底部
new Form({ children: [/* ... */], feedbackMode: 'tooltip' })
```

| 模式       | 说明                       |
| ---------- | -------------------------- |
| `inline`   | 默认模式，反馈信息内联显示 |
| `tooltip`  | 反馈信息以悬浮提示形式展示 |

## 自动完成

通过 `autocomplete` 选项控制表单的浏览器自动填充行为：

```ts
new Form({
  autocomplete: true, // 启用浏览器自动完成
  children: [/* ... */]
})
```

## FormOpts 完整参考

| 选项           | 类型                    | 默认值     | 说明                                           |
| -------------- | ----------------------- | ---------- | ---------------------------------------------- |
| `children`     | `SubModulesOpt`         | 必填       | 表单内容，可以是任意模块组合                    |
| `onSubmit`     | `() => void`            | -          | 提交回调，所有校验通过后触发                   |
| `autocomplete` | `boolean`               | `false`    | 是否启用浏览器自动完成                         |
| `feedbackMode` | `'inline' \| 'tooltip'` | `'inline'` | 校验反馈信息的展示模式                         |

## FormInput 基类

所有表单输入模块都继承自 `FormInput` 抽象类。`FormInput` 提供了校验反馈的基础能力：

| 方法                       | 说明                             |
| -------------------------- | -------------------------------- |
| `validate(): boolean`      | 抽象方法，子类必须实现校验逻辑   |
| `showInvalidFeedback(msg)` | 显示校验失败反馈信息             |
| `hideInvalidFeedback()`    | 隐藏校验失败反馈信息             |

## 内置表单输入模块一览

| 模块类型       | 说明                                                   | 详细文档 |
| -------------- | ------------------------------------------------------ | -------- |
| `TextInput`    | 文本输入框，支持必填、长度校验、自定义校验              | [查看](references/text-input.md) |
| `TelInput`     | 电话输入框，移动端弹出数字键盘                          | [查看](references/tel-input.md) |
| `SearchInput`  | 搜索输入框，移动端输入法展示搜索按钮                    | [查看](references/search-input.md) |
| `PasswordInput`| 密码输入框                                              | [查看](references/password-input.md) |
| `DateInput`    | 日期输入框，支持最小/最大日期校验                       | [查看](references/date-input.md) |
| `ColorInput`   | 颜色输入框                                              | [查看](references/color-input.md) |
| `NumberInput`  | 数字输入框，支持最小/最大值、步长、自定义校验           | [查看](references/number-input.md) |
| `FileInput`    | 文件输入框，支持多选、数量/尺寸校验                     | [查看](references/file-input.md) |
| `TextArea`     | 多行文本输入，支持自动高度                              | [查看](references/textarea.md) |
| `RadioGroup`   | 单选框组                                                | [查看](references/radio-group.md) |
| `CheckboxGroup`| 多选框组，支持最小/最大选择数量                         | [查看](references/checkbox-group.md) |
| `BoolCheckbox` | 布尔值单个勾选框，绑定布尔类型                          | [查看](references/bool-checkbox.md) |
| `Select`       | 下拉选择框，支持必填校验                                | [查看](references/select.md) |
| `Range`        | 滑动条，支持展示当前值                                  | [查看](references/range.md) |

## 自定义表单元素

如需自定义一个表单输入模块，需要创建一个继承自 `FormInput` 的类，实现 `validate` 方法，并在校验失败时使用 `showInvalidFeedback` 展示错误信息。

详细说明见：[自定义表单元素](references/custom-form-input.md)
