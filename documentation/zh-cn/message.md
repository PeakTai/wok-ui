# 消息提示

组件库内置了很多消息提示组件，可用于向用户展示信息和完成交互。

## 加载中

通过 showLoading 函数可以打开一个全屏覆盖显示加载中的提示，而通过 hideLoading 函数可以关闭全屏 loading。

使用示例：

```ts
// 加载数据前显示全屏 loading
showLoading('加载中...')
fetchData()
  .then(res => {
    // ...
  })
  .catch(err => {
    // 异常处理 ...
  })
  // 最终关闭 loading
  .finally(hideLoading)
```

目前全屏 loading 是单例的，如果重复调用 showLoading 函数，也只会显示同一个全屏 loading 模块。

## 弹出式消息

组件库提供了 showToast 函数用于展示弹出式消息，也同样提供了 showWarning 和 showSuccess 两个函数
可以更方便的快速展示警告和成功提示。

使用示例：

```ts
fetchData()
  .then(res => {
    // ...
    // 提示成功信息
    showSuccess('获取数据成功了！')
  })
  // 将错误信息通过 showWarning 提示出来
  .catch(showWarning)
```

调用 showWarning 和 showSuccess 函数弹出的消息会存在 3 秒后自动消失，如果
想要自定义持续时间，可以使用 showToast。

```ts
showToast({
  type: 'warning',
  text: '消息将存在5秒',
  duration: 5000
})
```

## 对话框

对话框是一种强交互式消息，用户必须完成交互才可以关闭对话框。

调用 showAlert 函数会弹出一个用户必须点击确认的对话框。

```ts
showAlert('无法重复提交订单').then(() => {
  // 用户点击确认后的操作 ...
})
```

调用 showConfirm 函数，会弹出一个让用户选择确认还是取消的对话框。

```ts
showConfirm('操作存在风险，是否继续？').then(res => {
  if (res) {
    // 用户选择了确定 ...
  } else {
    // 用户选择了取消 ...
  }
})
```
