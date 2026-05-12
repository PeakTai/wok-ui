---
name: icon
description: 介绍 wok-ui 图标系统的使用方法，包括 SvgIcon 本地图标和 RemoteSvgIcon 远程图标两种方式。
license: MIT
metadata:
  author: Peak Tai
  email: pektai@qq.com
---

# 图标

wok-ui 提供了 `SvgIcon` 和 `RemoteSvgIcon` 两种方式来使用 SVG 图标，均支持动态设置尺寸和颜色。

> **源码位置**：安装 wok-ui 后，图标模块的源码位于项目中的 `node_modules/wok-ui/lib/icon/` 目录下。
> 主要文件：
> - `svg-icon.ts` — `SvgIcon` 本地图标
> - `remote-svg-icon.ts` — `RemoteSvgIcon` 远程图标，按需加载
>
> 也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。
>
> 如果当前处于 wok-ui 仓库本身，源码可直接在 `lib/icon/` 目录下查看。

## SvgIcon 本地图标

创建自定义图标类，继承 `SvgIcon`，构造函数传入 SVG 代码字符串：

```ts
import { SvgIcon } from 'wok-ui'

class IconSuccess extends SvgIcon {
  constructor() {
    super(
      `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>`
    )
  }
}
```

`SvgIcon` 构造函数也支持配置对象形式，可同时设置尺寸、颜色和点击事件：

```ts
class IconEdit extends SvgIcon {
  constructor() {
    super({
      svgHtml: '<svg>...</svg>',
      size: 20,
      color: '#1677ff',
      onClick: () => console.log('clicked')
    })
  }
}
```

### 方法

| 方法                 | 说明               |
| -------------------- | ------------------ |
| `setSize(height)`    | 设置尺寸（px），链式调用 |
| `setColor(color)`    | 设置颜色，链式调用 |
| `onClick(callback)`  | 绑定点击事件，链式调用 |

```ts
import { getColor } from 'wok-ui'

new IconSuccess()
  .setSize(18)
  .setColor(getColor().success)
```

## RemoteSvgIcon 远程图标

当项目图标很多时，直接打包集成会增加包体积。`RemoteSvgIcon` 在首次使用时才从网络加载图标文件，且自动缓存。

```ts
import { RemoteSvgIcon } from 'wok-ui'

class IconAlarm extends RemoteSvgIcon {
  constructor() {
    super('/wok-ui/icons/alarm.svg')
  }
}
```

同样支持配置对象形式：

```ts
class IconSetting extends RemoteSvgIcon {
  constructor() {
    super({
      iconUrl: '/icons/setting.svg',
      size: 24,
      color: '#666',
      onClick: () => openSettings()
    })
  }
}
```

图标 URL 必须返回 `image/svg+xml` 格式，且状态码为 200。加载后自动缓存到内存中，多次实例化不会重复请求。

### 方法

与 `SvgIcon` 完全一致：`setSize`、`setColor`、`onClick`。

## 使用建议

| 场景             | 推荐方式          |
| ---------------- | ----------------- |
| 图标少、打包体积可控 | `SvgIcon` 本地集成  |
| 图标多、需要按需加载 | `RemoteSvgIcon` 远程加载 |
| 需要动态颜色/尺寸 | 两者都支持，通过方法链式调用 |
