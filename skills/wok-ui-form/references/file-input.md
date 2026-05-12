# FileInput

文件选择器，支持多选、文件数量和尺寸校验。显示已选文件名列表。

> **源码位置**：安装 wok-ui 后，源码位于 `node_modules/wok-ui/lib/form/input/file.ts`，样式位于 `node_modules/wok-ui/lib/form/input/style.less`。也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。如果在 wok-ui 仓库本身，源码在 `lib/form/input/file.ts`。

## 使用示例

```ts
import { FileInput } from 'wok-ui'

new FileInput({
  accept: '.jpg,.png,.pdf',
  multiple: true,
  required: true,
  minSelected: 1,
  maxSelected: { maxSelected: 5, errMsg: '最多选择5个文件' },
  maxSize: { maxSize: 10 * 1024 * 1024, errMsg: '文件总大小不能超过10MB' },
  size: 'lg',
  onChange(files) {
    if (files) {
      console.log('选择了', files.length, '个文件')
    }
  },
  validator(files) {
    return { valid: true }
  }
})
```

## 选项参考

| 选项          | 类型                                                     | 默认值      | 说明                                       |
| ------------- | -------------------------------------------------------- | ----------- | ------------------------------------------ |
| `required`    | `boolean \| string`                                      | -           | 是否必填                                   |
| `accept`      | `string`                                                 | `'*'`       | 接收文件类型，如 `'.jpg,.png'`             |
| `multiple`    | `boolean`                                                | `false`     | 是否允许多选                               |
| `minSelected` | `number \| { minSelected: number; errMsg: string }`      | -           | 最小选择文件数（多选时有效）               |
| `maxSelected` | `number \| { maxSelected: number; errMsg: string }`      | -           | 最大选择文件数（多选时有效）               |
| `minSize`     | `number \| { minSize: number; errMsg: string }`          | -           | 文件总最小尺寸（字节）                     |
| `maxSize`     | `number \| { maxSize: number; errMsg: string }`          | -           | 文件总最大尺寸（字节）                     |
| `size`        | `'sm' \| 'default' \| 'lg'`                              | `'default'` | 尺寸                                       |
| `onChange`    | `(files: FileList \| null) => void`                      | -           | 变化回调，取消选择时为 `null`              |
| `validator`   | `(files: FileList) => ValidateResult`                    | -           | 自定义校验函数                             |
