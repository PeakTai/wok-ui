---
name: wok-ui-heading
description: 介绍 wok-ui 标题模块的使用方法，包括 H1-H6 标题模块。
license: MIT
metadata:
  author: Peak Tai
  email: peaktai@qq.com
---

# 标题

wok-ui 提供了 `H1` 到 `H6` 六种标题模块，分别对应 HTML 的 `<h1>` 到 `<h6>` 标签，适用于页面标题层级结构。

> **源码位置**：安装 wok-ui 后，标题模块的源码位于项目中的 `node_modules/wok-ui/lib/heading/` 目录下。
> 主要文件：
> - `heading/index.ts` — `H1`-`H6` 标题模块
> - `heading/style.less` — 标题样式
>
> 也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。
>
> 如果当前处于 wok-ui 仓库本身，源码可直接在 `lib/heading/` 目录下查看。

## 基本使用

```ts
import { H1, H2, H3, H4, H5, H6 } from 'wok-ui'

new H1('页面大标题')
new H2('二级标题')
new H3('三级标题')
new H4('四级标题')
new H5('五级标题')
new H6('六级标题')
```

所有标题模块也支持传入配置对象，可在文本内容中嵌入模块并设置颜色：

```ts
import { H1, PrimaryBodyText, getColor } from 'wok-ui'

new H1({
  content: '带颜色的标题',
  color: getColor().primary
})

new H2({
  content: ['产品名称', 8, new PrimaryBodyText('（已认证）')],
  color: getColor().text
})
```

| 类型 | 对应标签 | 字号       | 说明                                         |
| ---- | -------- | ---------- | -------------------------------------------- |
| `H1` | `<h1>`   | `2.5rem`   | 一级标题，建议每个页面最多出现一个           |
| `H2` | `<h2>`   | `2rem`     | 二级标题                                     |
| `H3` | `<h3>`   | `1.75rem`  | 三级标题                                     |
| `H4` | `<h4>`   | `1.5rem`   | 四级标题                                     |
| `H5` | `<h5>`   | `1.25rem`  | 五级标题                                     |
| `H6` | `<h6>`   | `1rem`     | 六级标题                                     |

### 选项参考

| 选项      | 类型                              | 默认值 | 说明                                   |
| --------- | --------------------------------- | ------ | -------------------------------------- |
| (字符串)  | `string`                          | -      | 直接传入字符串作为标题文字             |
| `content` | `SubModulesOpt`                   | -      | 标题内容，可以是字符串或任意模块组合   |
| `color`   | `ColorKey`                        | -      | 标题颜色，仅配置对象形式支持           |

## 使用建议

| 场景               | 推荐方式                        |
| ------------------ | ------------------------------- |
| 页面大标题         | `H1`                            |
| 二级标题           | `H2`                            |
| 三级标题           | `H3`                            |
| 四级标题           | `H4`                            |
| 五级标题           | `H5`                            |
| 六级标题           | `H6`                            |
| 标题+嵌入模块      | `H1`-`H6` 配置对象形式          |
