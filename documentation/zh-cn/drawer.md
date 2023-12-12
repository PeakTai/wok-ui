# 抽屉

抽屉组件是贴边的弹窗，选项比模态框要简单一些，用于打开菜单或提示等。

## 基本使用

通过 showDrawer 函数可以构建一个抽屉模块并展示。

```ts
showDrawer({
  title: '这个是标题，可选',
  body: '要展示的内容',
  onClose() {
    showWarning('抽屉已经关闭')
  }
})
```

抽屉目前不支持按钮，有需要可在 body 中自定义。也不支持类似模态框将整个内容覆盖和静态背景的功能。

## 位置

通过 placement 选项可以控制抽屉出现的位置。

```ts
showDrawer({
  title: '上边',
  // 'left' | 'right' | 'top' | 'bottom'
  placement: 'top',
  body: '将从顶部弹出'
})
```

## 句柄控制

和模态框一样，showDrawer 函数也返回一个对象，带有 close 方法，可用于实现自定义方式来关闭。

```ts
const drawer = showDrawer({
  placement: 'left',
  body: new Button({
    text: '点击关闭抽屉',
    onClick(ev) {
      drawer.close()
    }
  })
})
```
