# 布局

为了更方便的完成各种布局需求，组件库内置了一些布局模块，基本上囊括了常见的布局。

## 水平堆叠盒子

使用 HBox 可以快速构建一个水平堆叠元素的容器。

```ts
new HBox({
  // 每个元素的间隙是 1rem
  gap: rem(1),
  // 要堆叠的子模块
  children: [
    '批量操作：',
    new Button({ text: '激活' }),
    new Button({ text: '冻结' }),
    new Button({ text: '删除' })
  ],
  // 如果一行放不下，可以换行显示
  wrap: true
  // 让元素垂直居中对齐
  align：'center'
})
```

## 垂直堆叠盒子

使用 VBox 可以快速构建一个垂直堆叠元素的容器。默认情况下块级元素就是从上往下堆叠的，
大部分时候我们不需要使用 VBox，VBox 只适合一些特殊情况。

```ts
new VBox({
  // 元素间的间隙是 1rem
  gap: rem(1),
  // 两端拉伸对齐
  align: 'stretch',
  // 要垂直堆叠的子模块
  children: [
    new Link({ content: '热门资讯' }),
    new Link({ content: '代码人生' }),
    new Link({ content: '实用工具' }),
    new Link({ content: '人工智能' })
  ]
})
```

## 两端对齐盒子

使用 JustifyBox 可以快速构建一个将两到多个元素两端对齐的元素。

```ts
new JustifyBox({
  align: 'top',
  children: [
    { children: ['79', rem(1), '文章'] },
    { children: ['163k', rem(1), '阅读'] },
    { children: ['256', rem(1), '粉丝'] }
  ]
})
```

## 上下分隔盒子

使用 VSplitBox 可以快速构建一个上下分隔的盒子，接收两个子模块，其中一个固定高度，另一个占满剩余的空间，
必须要给容器指定高度。

```ts
new VSplitBox({
  // 容器的高度
  height: window.innerHeight,
  // 设置头部固定高度
  fixedSide: 'top',
  // 头部
  top: { classNames: 'header', innerText: '在线学习管理后台' },
  // 底部，被拉伸占满剩余的空间
  bottom: {
    classNames: 'body',
    children: [
      //...
    ]
  }
})
```

## 左右分隔盒子

使用 HSplitBox 可以快速构建一个左右分隔的盒子，接收两个子模块，其中一个固定宽度，另一个占满剩余空间。

```ts
new HSplitBox({
  // 设置间隙为 12px
  gap: 12,
  // 顶部对齐
  align: 'top',
  // 左侧固定宽度
  fixedSide: 'left',
  // 左侧内容
  left: { classNames: 'avatar', attrs: { src: 'avatar-url' } },
  // 右侧内容
  right: {
    classNames: 'comment',
    children: ['张三 发表于6分钟前', rem(0.5), '这篇文章不错，赞！']
  }
})
```

## 网格

使用 Grid 可以快速构建一个指定列数的网格，适合于一些列表的布局。

```ts
new Grid({
  // 每行显示6列
  cols: 6,
  // 格子间的间隙
  gap: 12,
  // 设置每个格子至少宽 200px，避免一些特殊情况的严重变形
  // 会覆盖每行 6 列的设置，如果显示6列每个格子不够 200px
  // 则会提前换行，不保证每行 6 列
  cellMinWidth: 200,
  // 每个格子中的内容
  cells: [
    { classNames: 'item', children: ['Java 编程思想（第4版）', '出版时间：2007-6'] },
    { classNames: 'item', children: ['Linux 程序设计（第4版）', '出版时间：2010-6'] }
    // ......
  ]
})
```
