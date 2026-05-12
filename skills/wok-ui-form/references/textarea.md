# TextArea

多行文本输入框。支持自动高度，当内容超出行数时自动扩展。

> **源码位置**：安装 wok-ui 后，源码位于 `node_modules/wok-ui/lib/form/input/textarea.ts`，样式位于 `node_modules/wok-ui/lib/form/input/style.less`。也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。如果在 wok-ui 仓库本身，源码在 `lib/form/input/textarea.ts`。

## 使用示例

```ts
import { TextArea } from 'wok-ui'

new TextArea({
  value: '多行文本...',
  rows: 5,
  autoHeight: true,
  required: true,
  minLength: 10,
  maxLength: 500,
  placeholder: '请输入详细描述',
  onChange(val) {
    console.log('输入:', val)
  }
})
```

## 选项参考

在 [TextInput](text-input.md) 选项基础上新增：

| 选项         | 类型      | 默认值 | 说明                                       |
| ------------ | --------- | ------ | ------------------------------------------ |
| `rows`       | `number`  | `3`    | 默认行数                                   |
| `autoHeight` | `boolean` | -      | 是否自动高度，内容超出时自动扩展           |

## 方法

| 方法            | 说明               |
| --------------- | ------------------ |
| `focus()`       | 获取焦点           |
| `setValue(val)` | 设置值并触发校验   |
| `validate()`    | 执行校验并展示反馈 |
