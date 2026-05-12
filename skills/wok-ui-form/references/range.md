# Range

滑动条，基于原生 `input[type=range]`。支持展示当前值。

> **源码位置**：安装 wok-ui 后，源码位于 `node_modules/wok-ui/lib/form/range/index.ts`，样式位于 `node_modules/wok-ui/lib/form/range/style.less`。也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。如果在 wok-ui 仓库本身，源码在 `lib/form/range/` 目录下。

## 使用示例

```ts
import { Range } from 'wok-ui'

new Range({
  value: 50,
  min: 0,
  max: 100,
  step: 10,
  showValue: true,
  onChange(val) {
    console.log('当前值:', val)
  }
})
```

## 选项参考

| 选项        | 类型                      | 默认值 | 说明                                       |
| ----------- | ------------------------- | ------ | ------------------------------------------ |
| `value`     | `number`                  | 必填   | 初始值                                     |
| `min`       | `number`                  | 必填   | 最小值                                     |
| `max`       | `number`                  | 必填   | 最大值                                     |
| `step`      | `number`                  | `1`    | 步长                                       |
| `showValue` | `boolean`                 | `false`| 是否在滑块右侧展示当前值                   |
| `onChange`  | `(val: number) => void`   | -      | 变化回调                                   |

## 方法

| 方法                    | 说明                     |
| ----------------------- | ------------------------ |
| `validate()`            | 始终返回 `true`，不参与校验 |
| `setDisabled(disabled)` | 设置禁用状态             |

> **注意**：Range 的 `validate()` 始终返回 `true`，不参与表单校验。如需校验，请使用自定义表单元素。
