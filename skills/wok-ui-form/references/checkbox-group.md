# CheckboxGroup

多选框组，支持最小/最大选择数限制。达到最大选择数时，未选中的选项会自动禁用。

> **源码位置**：安装 wok-ui 后，源码位于 `node_modules/wok-ui/lib/form/checkbox/checkbox-group.ts`，样式位于 `node_modules/wok-ui/lib/form/checkbox/checkbox-group.less`。底层 Checkbox 模块源码位于 `node_modules/wok-ui/lib/form/checkbox/checkbox.ts`，样式位于 `node_modules/wok-ui/lib/form/checkbox/checkbox.less`。也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。如果在 wok-ui 仓库本身，源码在 `lib/form/checkbox/` 目录下。

## 使用示例

```ts
import { CheckboxGroup } from 'wok-ui'

new CheckboxGroup({
  value: ['reading', 'coding'],
  inline: true,
  required: true,
  minSelected: 1,
  maxSelected: 3,
  options: [
    { label: '阅读', value: 'reading' },
    { label: '编程', value: 'coding' },
    { label: '运动', value: 'sports' },
    { label: '音乐', value: 'music' }
  ],
  onChange(vals) {
    console.log('选择了:', vals)
  }
})
```

## 选项参考

| 选项          | 类型                                                     | 默认值  | 说明                                       |
| ------------- | -------------------------------------------------------- | ------- | ------------------------------------------ |
| `value`       | `string[]`                                               | -       | 默认选中值                                 |
| `inline`      | `boolean`                                                | `false` | 是否内联显示                               |
| `required`    | `boolean \| string`                                      | -       | 是否必填                                   |
| `minSelected` | `number \| { minSelected: number; errMsg: string }`      | -       | 最小选择数量                               |
| `maxSelected` | `number \| { maxSelected: number; errMsg: string }`      | -       | 最大选择数量，达到上限自动禁用未选项       |
| `disabled`    | `boolean`                                                | `false` | 是否禁用全部选项                           |
| `options`     | `Array<{ label: ConvertibleModule; value: string }>`     | 必填    | 选项列表                                   |
| `onChange`    | `(vals: string[]) => void`                               | -       | 变化回调                                   |

## 方法

| 方法                    | 说明             |
| ----------------------- | ---------------- |
| `validate()`            | 执行校验并展示反馈 |
| `setDisabled(disabled)` | 设置禁用状态     |
