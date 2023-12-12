# 图标

组件库提供了类型 SvgIcon 来封装 svg 图标，方便以编程的形式在模块中使用图标。

## 基本使用

要自定义一个图标，需要创建一个模块类型继承 SvgIcon。

```ts
class IconSuccess extends SvgIcon {
  constructor() {
    // 父构造器接收的是 svg 代码字符串
    super(
      `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>`
    )
  }
}
```

SvgIcon 有两个方法：setSize 和 setColor，分别用于设置尺寸和颜色。

```ts
// 创建自定义图标的实例，并设置颜色和大小
new IconSuccess().setSize(18).setColor(getColor().success)
```

## 远程图标

如果项目中的图标非常多，直接打包集成可能会导致包体积过大，从而影响加载速度。
组件库提供了类型 RemoteSvgIcon 来处理远程图标，与 SvgIcon 不同的是，RemoteSvgIcon 构造器
接收的是图标的地址，在使用时再加载图标文件，图标必须是 svg 格式。

```ts
class IconAlarm extends RemoteSvgIcon {
  constructor() {
    super('/wok-ui/icons/alarm.svg')
  }
}
```

RemoteSvgIcon 也有 setSize 和 setColor 方法，功能和 SvgIcon 是一样的。
