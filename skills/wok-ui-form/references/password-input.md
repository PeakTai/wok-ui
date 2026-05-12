# PasswordInput

密码输入框，继承 `TextInput`。输入时内容被掩盖。

> **源码位置**：安装 wok-ui 后，源码位于 `node_modules/wok-ui/lib/form/input/password.ts`。PasswordInput 是 TextInput 的简单子类，仅将 input type 设置为 `password`。也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。如果在 wok-ui 仓库本身，源码在 `lib/form/input/password.ts`。

## 使用示例

```ts
import { PasswordInput } from 'wok-ui'

new PasswordInput({
  placeholder: '请输入密码',
  required: true,
  minLength: 6,
  onChange(val) {
    console.log('密码已输入')
  }
})
```

## 选项参考

选项与 [TextInput](text-input.md) 完全一致。
