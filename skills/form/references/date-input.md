# DateInput

日期输入框，继承 `TextInput`。支持最小/最大日期校验，`onChange` 回调的参数类型为 `Date | undefined`。

> **源码位置**：安装 wok-ui 后，源码位于 `node_modules/wok-ui/lib/form/input/date.ts`。也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。如果在 wok-ui 仓库本身，源码在 `lib/form/input/date.ts`。

## 使用示例

```ts
import { DateInput } from 'wok-ui'

new DateInput({
  value: new Date(),
  required: true,
  min: new Date('2024-01-01'),
  max: { max: new Date(), errMsg: '日期不能超过今天' },
  size: 'lg',
  onChange(date) {
    console.log('选择的日期:', date)
  }
})
```

## 选项参考

| 选项          | 类型                                        | 默认值      | 说明                                       |
| ------------- | ------------------------------------------- | ----------- | ------------------------------------------ |
| `value`       | `Date`                                      | -           | 初始值                                     |
| `required`    | `boolean \| string`                         | -           | 是否必填                                   |
| `min`         | `Date \| { min: Date; errMsg: string }`     | -           | 最小日期                                   |
| `max`         | `Date \| { max: Date; errMsg: string }`     | -           | 最大日期                                   |
| `disabled`    | `boolean`                                   | -           | 是否禁用                                   |
| `placeholder` | `string`                                    | -           | 占位提示信息                               |
| `size`        | `'sm' \| 'default' \| 'lg'`                 | `'default'` | 尺寸                                       |
| `onChange`    | `(val?: Date) => void`                      | -           | 变化回调，空值时为 `undefined`             |
| `onBlur`      | `() => void`                                | -           | 失去焦点回调                               |
