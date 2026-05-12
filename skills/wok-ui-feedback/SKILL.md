---
name: wok-ui-feedback
description: 介绍 wok-ui 用户反馈系统的使用方法，包括全屏 Loading、弹出式 Toast（成功/警告）、对话框（Alert/Confirm）。
license: MIT
metadata:
  author: Peak Tai
  email: pektai@qq.com
---

# 用户反馈

wok-ui 内置了一套用户反馈系统，包括全屏 Loading、弹出式 Toast 消息、以及需要用户交互的 Alert/Confirm 对话框。

> **源码位置**：安装 wok-ui 后，反馈模块的源码位于项目中的 `node_modules/wok-ui/lib/message/` 目录下。
> 主要文件：
> - `loading.ts` — `showLoading` / `hideLoading`
> - `toast.ts` — `showToast` / `showSuccess` / `showWarning`
> - `dialog.ts` — `showAlert` / `showConfirm`
>
> 也可查阅类型定义文件 `node_modules/wok-ui/types/index.d.ts` 确认导出接口。
>
> 如果当前处于 wok-ui 仓库本身，源码可直接在 `lib/message/` 目录下查看。

## 全屏 Loading

`showLoading` 显示全屏覆盖的加载提示，`hideLoading` 关闭。Loading 是单例的，重复调用 `showLoading` 只显示同一个实例。

```ts
import { showLoading, hideLoading } from 'wok-ui'

showLoading('加载中...')
fetchData()
  .then(handleData)
  .catch(handleError)
  .finally(hideLoading)
```

| 函数               | 说明                       |
| ------------------ | -------------------------- |
| `showLoading(msg?)` | 显示全屏 loading，`msg` 可选 |
| `hideLoading()`     | 关闭全屏 loading           |

## Toast 弹出消息

### showSuccess / showWarning

快捷函数，消息 3 秒后自动消失：

```ts
import { showSuccess, showWarning } from 'wok-ui'

fetchData()
  .then(() => showSuccess('获取数据成功'))
  .catch(showWarning)
```

`showWarning` 接收 `string`、`Error` 或其他类型（自动 `JSON.stringify`）：

```ts
showWarning('操作失败')
showWarning(new Error('网络错误'))
```

### showToast

自定义持续时间和类型：

```ts
import { showToast } from 'wok-ui'

showToast({
  type: 'warning',
  text: '消息将存在 5 秒',
  duration: 5000
})
```

| 函数         | 说明                                        |
| ------------ | ------------------------------------------- |
| `showSuccess(text)` | 显示成功消息，3 秒自动消失            |
| `showWarning(err)`  | 显示警告消息，3 秒自动消失            |
| `showToast(opts)`   | 自定义类型和持续时间的弹出消息        |

`showToast` 选项：

| 选项       | 类型                      | 默认值   | 说明             |
| ---------- | ------------------------- | -------- | ---------------- |
| `type`     | `'success' \| 'warning'`  | 必填     | 消息类型         |
| `text`     | `string`                  | 必填     | 消息内容         |
| `duration` | `number`                  | `3000`   | 持续时间（毫秒） |

## 对话框

### showAlert

弹出用户必须点击确定的提示框，返回 `Promise<void>`：

```ts
import { showAlert } from 'wok-ui'

showAlert('无法重复提交订单').then(() => {
  console.log('用户点击了确定')
})
```

### showConfirm

弹出确认/取消选择框，返回 `Promise<boolean>`：

```ts
import { showConfirm } from 'wok-ui'

const confirmed = await showConfirm('操作存在风险，是否继续？')
if (confirmed) {
  // 用户选择了确定
} else {
  // 用户选择了取消
}
```

> **注意**：Alert/Confirm 的标题和按钮文字由 i18n 控制，切换语言后自动适配。

| 函数               | 返回类型            | 说明                         |
| ------------------ | ------------------- | ---------------------------- |
| `showAlert(msg)`   | `Promise<void>`     | 确认对话框，强制用户点击确定 |
| `showConfirm(msg)` | `Promise<boolean>`  | 确认/取消选择框              |
