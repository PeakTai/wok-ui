# ColorInput

颜色选择器，继承 `TextInput`。点击弹出原生颜色选择器。

> **源码位置**：安装 wok-ui 后，源码位于 `node_modules/wok-ui/lib/form/input/color.ts`，样式位于 `node_modules/wok-ui/lib/form/input/color.less`。也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。如果在 wok-ui 仓库本身，源码在 `lib/form/input/color.ts`。

## 使用示例

```ts
import { ColorInput } from 'wok-ui'

new ColorInput({
  value: '#ff0000',
  required: true,
  onChange(color) {
    console.log('选择的颜色:', color)
  }
})
```

## 选项参考

选项与 [TextInput](text-input.md) 类似，但去掉了 `maxLength`、`minLength`、`placeholder`、`onBlur` 选项。
