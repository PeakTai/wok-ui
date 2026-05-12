# SearchInput

搜索输入框，继承 `TextInput`。在移动端输入法会展示搜索按钮，方便用户输入完成后直接提交表单。部分 PC 浏览器还支持清除按钮。

> **源码位置**：安装 wok-ui 后，源码位于 `node_modules/wok-ui/lib/form/input/search.ts`。SearchInput 是 TextInput 的简单子类，仅将 input type 设置为 `search`。也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。如果在 wok-ui 仓库本身，源码在 `lib/form/input/search.ts`。

## 使用示例

```ts
import { SearchInput } from 'wok-ui'

new SearchInput({
  placeholder: '搜索...',
  onChange(val) {
    console.log('搜索:', val)
  }
})
```

## 选项参考

选项与 [TextInput](text-input.md) 完全一致。
