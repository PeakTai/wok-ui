# BoolCheckbox

布尔值勾选框，单个勾选框绑定 `boolean` 类型值。

> **源码位置**：安装 wok-ui 后，源码位于 `node_modules/wok-ui/lib/form/checkbox/bool-checkbox.ts`，样式位于 `node_modules/wok-ui/lib/form/checkbox/bool-checkbox.less`。底层 Checkbox 模块源码位于 `node_modules/wok-ui/lib/form/checkbox/checkbox.ts`。也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。如果在 wok-ui 仓库本身，源码在 `lib/form/checkbox/` 目录下。

## 使用示例

```ts
import { BoolCheckbox } from 'wok-ui'

new BoolCheckbox({
  value: true,
  label: '我已阅读并同意服务条款',
  required: '请先同意服务条款',
  onChange(checked) {
    console.log('勾选状态:', checked)
  }
})
```

## 选项参考

| 选项       | 类型                        | 默认值  | 说明                                       |
| ---------- | --------------------------- | ------- | ------------------------------------------ |
| `value`    | `boolean`                   | `false` | 初始勾选状态                               |
| `required` | `boolean \| string`         | -       | 是否必选                                   |
| `label`    | `ConvertibleModule`         | 必填    | 勾选框标签文字                             |
| `disabled` | `boolean`                   | `false` | 是否禁用                                   |
| `onChange` | `(value: boolean) => void`  | -       | 变化回调                                   |

## 方法

| 方法                    | 说明             |
| ----------------------- | ---------------- |
| `isChecked()`           | 获取当前勾选状态 |
| `validate()`            | 执行校验并展示反馈 |
| `setDisabled(disabled)` | 设置禁用状态     |
