# TextInput

文本输入框，是大部分文本类输入的基础组件。TelInput、SearchInput、PasswordInput、DateInput、ColorInput、NumberInput 均继承自它。

> **源码位置**：安装 wok-ui 后，源码位于 `node_modules/wok-ui/lib/form/input/text.ts`，样式位于 `node_modules/wok-ui/lib/form/input/style.less`。也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。如果在 wok-ui 仓库本身，源码在 `lib/form/input/text.ts`。

## 使用示例

```ts
import { TextInput } from 'wok-ui'

new TextInput({
  value: '初始值',
  required: true,
  minLength: 2,
  maxLength: { maxLength: 32, errMsg: '最多输入32个字符' },
  placeholder: '请输入用户名',
  size: 'lg',
  onChange(val) {
    console.log('输入:', val)
  },
  onBlur() {
    console.log('失去焦点')
  },
  autofocus: true,
  validator(val) {
    if (val.includes(' ')) {
      return { valid: false, msg: '不允许包含空格' }
    }
    return { valid: true }
  }
})
```

## 选项参考

| 选项          | 类型                                              | 默认值      | 说明                                       |
| ------------- | ------------------------------------------------- | ----------- | ------------------------------------------ |
| `value`       | `string`                                          | -           | 初始值                                     |
| `required`    | `boolean \| string`                               | -           | 是否必填，字符串可指定自定义错误信息       |
| `minLength`   | `number \| { minLength: number; errMsg: string }` | -           | 最小长度                                   |
| `maxLength`   | `number \| { maxLength: number; errMsg: string }` | -           | 最大长度                                   |
| `placeholder` | `string`                                          | -           | 占位提示信息                               |
| `disabled`    | `boolean`                                         | -           | 是否禁用                                   |
| `size`        | `'sm' \| 'default' \| 'lg'`                       | `'default'` | 尺寸                                       |
| `onChange`    | `(val: string) => void`                           | -           | 输入变化回调                               |
| `onBlur`      | `() => void`                                      | -           | 失去焦点回调                               |
| `autofocus`   | `boolean`                                         | -           | 挂载后自动获取焦点                         |
| `validator`   | `(val: string) => ValidateResult`                 | -           | 自定义校验函数                             |

## 方法

| 方法        | 说明                  |
| ----------- | --------------------- |
| `focus()`   | 获取焦点              |
| `validate()`| 执行校验并展示反馈    |
