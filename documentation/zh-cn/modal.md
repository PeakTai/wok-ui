# 模态框

通过模态框可以创建一个自定义内容的对话框，为了更加方便使用，组件库提供了函数来快速构建模态框。

## 基本使用

通过 showModal 函数可以快速构建一个模态框模块并展示。

```ts
showModal({
  title: '标题',
  // 自定义宽度，默认 500
  width: 500,
  // 正文是任意的可转换为模块的内容
  body: '正文内容'
})
```

## 全屏

通过将 fullscreen 参数设置为 true ,可以让模态框全屏展示。

```ts
showModal({
  title: '标题',
  fullscreen: true,
  body: '正文内容'
})
```

## 静态背景

通过将参数 staticBackDrop 设置为 true ，可以将让模态框的背景纯粹作为背景，而不能点击关闭模态框，
默认是带有点击关闭功能的。

```ts
showModal({
  title: '标题',
  staticBackDrop: true,
  body: '无法点击背景关闭'
})
```

设置静态背景后，再点击背景，模态框会抖动，提示用户不能这样操作。

## 关闭按钮与回调

通过参数 closeBtn 可以设置是否显示关闭按钮，必须 title 参数有值才可以，否则整个标题不显示，关闭按钮
也就不会显示。通过 onClose 选项可以监听模态框被关闭的事件。

```ts
showModal({
  title: '标题',
  closeBtn: false,
  body: '无关闭按钮，只能点击背景关闭',
  onClose: () => showWarning('模态框被关闭了')
})
```

## 通过句柄来关闭

showModal 函数会返回一个对象，带有 close 方法用于关闭模态框，可用于实现自定义方式来关闭。

```ts
const modal = showModal({
  title: '标题',
  closeBtn: false,
  staticBackDrop: true,
  body: new Button({
    text: '点击关闭模态框',
    onClick: () => {
      // 调用 close 方法在适当的时候主动关闭
      modal.close()
    }
  })
})
```

## 自定义脚部按钮

通过 buttons 参数可以设置脚部按钮，一个是确定按钮，一个是取消按钮，都是可选的。

下面是一个结合表单的例子：

```ts
const formData = {
  account: '',
  pwd: ''
}
let form = new Form({
  children: [
    new TextInput({
      value: formData.account,
      placeholder: '请输入帐号',
      required: true
    }),
    rem(1),
    new PasswordInput({
      value: formData.pwd,
      placeholder: '请输入密码',
      required: true,
      maxLength: 16
    })
  ],
  onSubmit: () =>
    login(formData)
      .then(() => {
        // 登录成功后关闭模态框
        modal.close()
      })
      .catch(showWarning)
})
const modal = showModal({
  title: '登录',
  body: form,
  // 显示确定和取消按钮
  buttons: {
    // confirm 和 cancel 值可以是布尔类型或字符串类型
    // 字符串类型表示自定义的按钮文本
    confirm: '登录',
    cancel: true
  },
  // 处理点击确定的事件
  onConfirm() {
    // 点击确定时，主动触发表单的提交
    // 调用表单的 submit() 方法会在校验成功后触发表单的 onSubmit 回调
    form.submit()
  }
  // 取消按钮会触发关闭，没有单独的事件回调，如果有需要可以设置 onClose
})
```

## 完全自定义内容

如果不使用模态框预设的样式，也可以完全自定义。通过将选项 replaceByBody 设置为 true ，
可以让 body 选项的模块替换掉整个模态框。

```ts
const modal = showModal({
  // 设置替换掉整个模态框
  replaceByBody: true,
  staticBackDrop: true,
  // body 中的内容变成整个模态框的内容
  body: {
    classNames: 'custom',
    children: [
      '条款内容',
      rem(1),
      '请耐心看完以下的内容',
      '看完所有内容后',
      '点击底部的按钮关闭',
      rem(1),
      new Button({
        text: '我已阅读全部内容并同意',
        onClick(ev) {
          modal.close()
        }
      })
    ]
  }
})
```
