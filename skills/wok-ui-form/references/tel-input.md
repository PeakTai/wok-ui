# TelInput

电话号码输入框，继承 `TextInput`。在移动端会弹出数字键盘，方便输入电话号码。

> **源码位置**：安装 wok-ui 后，源码位于 `node_modules/wok-ui/lib/form/input/tel.ts`。TelInput 是 TextInput 的简单子类，仅将 input type 设置为 `tel`。也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。如果在 wok-ui 仓库本身，源码在 `lib/form/input/tel.ts`。

## 使用示例

```ts
import { TelInput } from 'wok-ui'

new TelInput({
  placeholder: '请输入手机号',
  required: true,
  onChange(val) {
    console.log('电话:', val)
  }
})
```

## 选项参考

选项与 [TextInput](text-input.md) 完全一致。
