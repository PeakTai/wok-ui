# 自定义表单元素

当内置表单元素无法满足需求时，可以通过继承 `FormInput` 抽象类来自定义表单输入模块。

## 基本步骤

1. 创建一个类继承 `FormInput`
2. 实现 `validate()` 方法，返回 `boolean`
3. 在校验失败时调用 `showInvalidFeedback(errMsg)`，通过时调用 `hideInvalidFeedback()`
4. 在值变化时调用 `this.validate()` 触发实时校验反馈

## FormInput 基类

```ts
abstract class FormInput extends Module {
  constructor(elOrClass?: HTMLElement | string)
  abstract validate(): boolean
  protected showInvalidFeedback(errMsg: string): void
  protected hideInvalidFeedback(): void
}
```

- `constructor`：可传入自定义 DOM 元素或 CSS 类名，不传则默认创建 `div`
- `validate()`：抽象方法，子类必须实现校验逻辑，返回 `true` 表示通过
- `showInvalidFeedback(msg)`：显示校验失败信息，内部通过 `InvalidFeedback` 模块展示
- `hideInvalidFeedback()`：隐藏校验失败信息

## 简单示例：开关模块

一个开关模块，绑定布尔值，支持必选校验：

```ts
import { FormInput } from 'wok-ui'

class Switch extends FormInput {
  private checked = false

  constructor(
    private readonly opts: {
      value?: boolean
      required?: boolean | string
      onChange?: (checked: boolean) => void
    }
  ) {
    super('switch')
    if (opts.value) {
      this.checked = opts.value
    }
    // 构建 UI
    this.addChild({
      tag: 'button',
      classNames: ['switch-btn', this.checked ? 'on' : 'off'],
      innerText: this.checked ? 'ON' : 'OFF',
      onClick: () => {
        this.checked = !this.checked
        this.el.className = `switch ${this.checked ? 'on' : 'off'}`
        const btn = this.el.querySelector('button')!
        btn.className = `switch-btn ${this.checked ? 'on' : 'off'}`
        btn.innerText = this.checked ? 'ON' : 'OFF'
        if (this.opts.onChange) {
          this.opts.onChange(this.checked)
        }
        this.validate()
      }
    })
  }

  validate(): boolean {
    if (this.opts.required && !this.checked) {
      this.showInvalidFeedback(
        typeof this.opts.required === 'string'
          ? this.opts.required
          : '此项必须开启'
      )
      return false
    }
    this.hideInvalidFeedback()
    return true
  }
}
```

在 Form 中使用自定义开关：

```ts
new Form({
  children: [
    new Switch({
      required: '请开启通知',
      onChange(checked) {
        console.log('通知状态:', checked)
      }
    }),
    new Button({ text: '提交', type: 'primary', formType: 'submit' })
  ],
  onSubmit: () => {
    console.log('提交成功')
  }
})
```

## 完整示例：上传器

下面的示例演示了一个文件上传器，支持必填和文件大小校验：

```ts
import { FormInput, getI18n } from 'wok-ui'

class Uploader extends FormInput {
  private file?: File

  constructor(
    private readonly opts: {
      required?: boolean
      accept?: string
      max?: number
      onChange?: (file?: File) => void
    }
  ) {
    super(document.createElement('label'))
    this.el.classList.add('uploader')
    // label 套一个隐藏的 input[type=file]
    this.addChild({
      tag: 'input',
      attrs: { type: 'file', accept: opts.accept || '*' },
      style: { display: 'none' },
      postHandle: el => {
        const input = el as HTMLInputElement
        input.onchange = () => {
          this.file = input.files && input.files.length ? input.files[0] : undefined
          if (this.opts.onChange) {
            this.opts.onChange(this.file)
          }
          this.validate()
        }
      }
    })
    // 选择文件的展示内容
    this.addChild('请选择文件')
  }

  private __validate(): { valid: false; errmsg: string } | { valid: true } {
    if (!this.file) {
      if (this.opts.required) {
        return { valid: false, errmsg: '文件必填' }
      }
      return { valid: true }
    }
    if (typeof this.opts.max === 'number') {
      if (this.file.size > this.opts.max) {
        return { valid: false, errmsg: '文件过大' }
      }
    }
    return { valid: true }
  }

  validate(): boolean {
    const res = this.__validate()
    if (res.valid) {
      this.el.classList.remove('invalid')
      this.hideInvalidFeedback()
    } else {
      this.el.classList.add('invalid')
      this.showInvalidFeedback(res.errmsg)
    }
    return res.valid
  }
}
```

### 关键点说明

1. **继承 FormInput**：`constructor` 中可以传入自定义 DOM 元素或类名
2. **值变化时调用 `this.validate()`**：确保实时反馈校验结果
3. **使用 `showInvalidFeedback` / `hideInvalidFeedback`**：`FormInput` 提供的受保护方法，自动管理反馈信息模块的创建与销毁
4. **返回 `boolean`**：`validate()` 返回 `true` 表示校验通过，`false` 表示失败

## 与 Form 的集成

自定义表单元素与内置元素在 Form 中的行为完全一致：

- Form 的 `submit()` 会自动调用所有后代 `FormInput` 的 `validate()`
- 校验失败时，Form 不会触发 `onSubmit` 回调
- 反馈信息的展示样式由 Form 的 `feedbackMode` 选项控制（`inline` 或 `tooltip`）

## 使用 i18n 的错误信息

推荐使用 `getI18n().buildMsg()` 来获取国际化的错误提示：

```ts
import { FormInput, getI18n } from 'wok-ui'

class MyInput extends FormInput {
  validate(): boolean {
    if (/* 校验失败 */) {
      this.showInvalidFeedback(getI18n().buildMsg('form-err-required'))
      return false
    }
    this.hideInvalidFeedback()
    return true
  }
}
```
