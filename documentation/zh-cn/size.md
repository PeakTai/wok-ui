# 尺寸

组件库有统一的尺寸管理，每一种尺寸都有对应的 css 变量可供使用，所有的内置组件都应用了这套尺寸设置。

## 单位

组件库内置的所有组件中涉及尺寸大小的属性，单位都是像素（px）。这样做是因为 dom 接口都
是以像素为单位的，统一使用像素方便封装。

组件库提供了一个 rem 函数，可以通过这个函数来转换 rem 单位。

```ts
createDomModule({
  children: ['第一段文字', rem(1), '第二段文字，与第一段间隙 1rem']
})
```

## css 变量

| css 变量             | 对应属性名称 | 意义                        |
| :------------------- | :----------- | :-------------------------- |
| --size-text          | text         | 默认文字大小，默认值为 1rem |
| --size-text-sm       | textSm       | 小号文字大小，默认 0.75rem   |
| --size-text-lg       | textLg       | 大号文字大小，默认 1.25rem   |
| --size-text-xl       | textXl       | 超大号文字大小，默认 1.5rem |
| --size-border-radius | borderRadius | 圆角半径，默认 0.375rem     |

## 设置尺寸信息

通过 setSize 函数可以更改默认设置。

```ts
setSize({
  text: 16,
  textSm: 14,
  textLg: 18,
  textXl: 22,
  borderRadius: 5
})
```

调用 setSize 后， css 变量会被立即改变，部分模块可能会立即发生变化，但是依赖 api
的实现不会立即响应，最好重新渲染。

由于这个操作具有危险性，操作不当可能会导致混乱，组件库提供了 resetSize 函数，可以
在需要的时候进行重置，恢复成默认。

## 获取尺寸信息

通过 getSize 函数可以获取当前的尺寸信息。

```ts
// 获取默认的文字大小
const { text } = getSize()
```
