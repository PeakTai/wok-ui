# 文本

组件库提供了 Text 类型来构建基础文本，以及一套预设文本类型。

## 预设

预设对象可以直接被使用，简单方便，适用于常见的应用场景。

| 预设类型               | 说明                 |
| :--------------------- | :------------------- |
| PrimaryBodyText        | 主要正文             |
| SecondaryBodyText      | 次要正文             |
| SmallSecondaryBodyText | 小号次要正文         |
| Title                  | 标题，对应 h2 标签   |
| LargeTitle             | 大标题，对应 h1 标签 |

示例：

```ts
createDomModule({
  children: [
    new LargeTitle('页面大标题'),
    16,
    new PrimaryBodyText('正文内容'),
    '字符串转换的默认文本，与正文不一样的是受父元素的样式影响'
  ]
})
```

## Text

如果需要对文本做更多设置，可以使用 Text 类型。

```ts
new Text({
  // 生成的标签，默认 span
  tag: 'span',
  // 文本内容
  text: '文本内容',
  // 加粗
  bold: true,
  // 颜色，这里使用了主题色
  color: getColor().primary,
  // 点击事件
  onClick(ev) {
    ev.preventDefault()
    // TODO 处理点击事件
  }
})
```

除 text 选项外，其它选项都是可选的。

前面的预设类型都是 Text 的子类，Text 还支持链式写法，有时候可以基于预设类型快速做一些修改。

```ts
new PrimaryBodyText('高亮文本').setColor(getColor().primary)
```
