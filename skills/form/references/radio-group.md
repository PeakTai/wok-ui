# RadioGroup

单选框组，同一时刻只能选中一个选项。

> **源码位置**：安装 wok-ui 后，源码位于 `node_modules/wok-ui/lib/form/radio/radio-group.ts`，样式位于 `node_modules/wok-ui/lib/form/radio/radio-group.less`。底层 Radio 模块源码位于 `node_modules/wok-ui/lib/form/radio/radio.ts`，样式位于 `node_modules/wok-ui/lib/form/radio/radio.less`。也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。如果在 wok-ui 仓库本身，源码在 `lib/form/radio/` 目录下。

## 使用示例

```ts
import { RadioGroup } from 'wok-ui'

new RadioGroup({
  value: 'male',
  inline: true,
  required: true,
  disabled: false,
  options: [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' },
    { label: '保密', value: 'secret' }
  ],
  onChange(val) {
    console.log('选择:', val)
  }
})
```

## 选项参考

| 选项       | 类型                                                   | 默认值  | 说明                                       |
| ---------- | ------------------------------------------------------ | ------- | ------------------------------------------ |
| `value`    | `string`                                               | -       | 默认值                                     |
| `inline`   | `boolean`                                              | `false` | 是否内联显示（默认一行一个）               |
| `required` | `boolean \| string`                                    | -       | 是否必填                                   |
| `disabled` | `boolean`                                              | `false` | 是否禁用全部选项                           |
| `options`  | `Array<{ label: ConvertibleModule; value: string }>`   | 必填    | 选项列表                                   |
| `onChange` | `(val: string) => void`                                | -       | 变化回调                                   |

## 方法

| 方法                    | 说明             |
| ----------------------- | ---------------- |
| `validate()`            | 执行校验并展示反馈 |
| `setDisabled(disabled)` | 设置禁用状态     |
