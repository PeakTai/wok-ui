# NumberInput

数字输入框，继承 `TextInput`。支持最小/最大值、步长校验，`onChange` 回调参数类型为 `number | undefined`。

> **源码位置**：安装 wok-ui 后，源码位于 `node_modules/wok-ui/lib/form/input/number.ts`。也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。如果在 wok-ui 仓库本身，源码在 `lib/form/input/number.ts`。

## 使用示例

```ts
import { NumberInput } from 'wok-ui'

new NumberInput({
  value: 10,
  required: true,
  min: 1,
  max: { max: 100, errMsg: '不能超过100' },
  step: 5,
  size: 'lg',
  onChange(val) {
    console.log('数字:', val)
  },
  validator(val) {
    if (val % 2 !== 0) {
      return { valid: false, msg: '请输入偶数' }
    }
    return { valid: true }
  }
})
```

## 选项参考

| 选项          | 类型                                        | 默认值      | 说明                                       |
| ------------- | ------------------------------------------- | ----------- | ------------------------------------------ |
| `value`       | `number`                                    | -           | 初始值                                     |
| `required`    | `boolean \| string`                         | -           | 是否必填                                   |
| `min`         | `number \| { min: number; errMsg: string }` | -           | 最小值                                     |
| `max`         | `number \| { max: number; errMsg: string }` | -           | 最大值                                     |
| `step`        | `number`                                    | -           | 步长                                       |
| `disabled`    | `boolean`                                   | -           | 是否禁用                                   |
| `placeholder` | `string`                                    | -           | 占位提示信息                               |
| `size`        | `'sm' \| 'default' \| 'lg'`                 | `'default'` | 尺寸                                       |
| `onChange`    | `(val?: number) => void`                    | -           | 变化回调，空值时为 `undefined`             |
| `onBlur`      | `() => void`                                | -           | 失去焦点回调                               |
| `validator`   | `(val: number) => ValidateResult`           | -           | 自定义校验函数                             |
