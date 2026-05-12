# Select

下拉选择框，支持字符串数组和带 `label`/`value` 的对象数组两种选项格式。

> **源码位置**：安装 wok-ui 后，源码位于 `node_modules/wok-ui/lib/form/select/index.ts`，样式位于 `node_modules/wok-ui/lib/form/select/style.less`。也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。如果在 wok-ui 仓库本身，源码在 `lib/form/select/` 目录下。

## 使用示例

```ts
import { Select } from 'wok-ui'

// 简单字符串选项
new Select({
  value: 'option2',
  required: true,
  options: ['选项1', '选项2', '选项3'],
  onChange(val) {
    console.log('选择:', val)
  }
})

// 带 label/value 的选项
new Select({
  required: '请选择一项',
  disabled: false,
  size: 'lg',
  options: [
    { label: '中国', value: 'cn' },
    { label: '美国', value: 'us' },
    { label: '日本', value: 'jp' }
  ],
  onChange(val) {
    console.log('选择:', val)
  }
})
```

## 选项参考

| 选项       | 类型                                                          | 默认值      | 说明                                       |
| ---------- | ------------------------------------------------------------- | ----------- | ------------------------------------------ |
| `value`    | `string`                                                      | -           | 默认值                                     |
| `required` | `boolean \| string`                                           | -           | 是否必填                                   |
| `disabled` | `boolean`                                                     | `false`     | 是否禁用                                   |
| `size`     | `'sm' \| 'default' \| 'lg'`                                   | `'default'` | 尺寸                                       |
| `options`  | `Array<{ label: string; value: string } \| string>`           | 必填        | 选项列表                                   |
| `onChange` | `(val: string) => void`                                       | -           | 变化回调                                   |

## 方法

| 方法                    | 说明             |
| ----------------------- | ---------------- |
| `validate()`            | 执行校验并展示反馈 |
| `setDisabled(disabled)` | 设置禁用状态     |
