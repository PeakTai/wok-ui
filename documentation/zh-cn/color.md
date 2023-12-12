# 颜色

组件库也同样提供了统一的颜色管理，与尺寸一起构成了各个内置模块的统一标准。

## css 变量

| css 变量               | 属性名称      | 说明                   |
| :--------------------- | :------------ | :--------------------- |
| --color-primary        | primary       | 主题色，默认是蓝色     |
| --color-danger         | danger        | 危险色，默认红色       |
| --color-success        | success       | 成功色，默认绿色       |
| --color-warning        | warning       | 警告色，默认橙色       |
| --color-border         | border        | 边框，默认浅灰         |
| --color-text           | text          | 文字颜色，默认黑色     |
| --color-text-secondary | textSecondary | 次级文字颜色，默认深灰 |
| --color-outline        | outline       | 轮廓描边，默认浅蓝     |

## 更改颜色设置

通过 setColor 函数可以更改颜色设置。

```ts
setColor({
  primary: '#1677ff',
  danger: '#ff4d4f',
  success: '#198754',
  warning: '#ffc107',
  border: '#dee2e6',
  text: '#303133',
  textSecondary: '#909399',
  outline: '#b1d2ff'
})
```

通过 resetColor 函数，可以将颜色设置复原。

## 获取当前颜色设置

通过 getColor 函数可以获取颜色信息。

```ts
// 获取主题色
const { primary } = getColor()
```
