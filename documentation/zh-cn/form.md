# 表单

组件库提供了一整套表单模块，覆盖了常用的输入元素，并且支持扩展。

## 基本使用

通过构建 Form 模块的实例来创建一个表单。

```ts
const formData = {
  name: 'Jack',
  gender: '男'
}
// 这里仅仅是为了演示，实际使用中可以将 Form 实例插入到任何接收模块类型的地方
new Form({
  children: [
    '姓名：',
    rem(0.5),
    new TextInput({
      value: formData.name,
      // 要求姓名必填, 长度在 2-32 位之间
      required: true,
      minLength: 2,
      maxLength: 32,
      onChange(val) {
        formData.name = val
      }
    }),
    rem(1),
    '性别：',
    rem(0.5),
    new RadioGroup({
      value: formData.gender,
      options: [
        { label: '男', value: '男' },
        { label: '女', value: '女' },
        { label: '保密', value: '保密' }
      ],
      onChange(val) {
        formData.gender = val
      }
    }),
    rem(1),
    // 提交按钮，点击触发表单提交
    new Button({
      formType: 'submit',
      text: '提交修改'
    })
  ],
  onSubmit: () => {
    // 处理提交事件
    showLoading('保存中')
    saveData(formData)
      .then(() => showSuccess('保存成功'))
      .catch(showWarning)
      .finally(hideLoading)
  }
})
```

Form 类型对于 children 参数的类型没有强约束，可以是任何模块，但是只有实现了 FormInput 类型的元素
才会被看作是表单元素，在提交表单时会检查这些表单元素是否都校验通过，全通过才会触发提交事件。
对于数据也没有强制绑定操作，需要在表单元素的回调中自行处理，这样做是为了能够更加灵活应对各类较复杂的需求。

## 内置的表单模块

下表是所有内置的表单元素模块说明。

| 模块类型      | 说明                                             |
| :------------ | :----------------------------------------------- |
| TextInput     | 文本输入框                                       |
| TelInput      | 电话输入框，在移动端会弹出相应的输入法           |
| SearchInput   | 搜索输入框，移动端输入法会展示搜索按钮           |
| PasswordInput | 密码输入框                                       |
| DateInput     | 日期输入框                                       |
| ColorInput    | 颜色输入框                                       |
| NumberInput   | 数字输入框                                       |
| FileInput     | 文件输入框                                       |
| TextArea      | 多行文本                                         |
| RadioGroup    | 单选框组                                         |
| CheckboxGroup | 多选框组                                         |
| BoolCheckbox  | 布尔值单个勾选框，回调的值是布尔类型表示勾选与否 |
| Select        | 下拉选择框                                       |
| Range         | 滑动条                                           |

## 自定义表单元素模块

如需自定义一个表单元素，需要创建一个模块继承自 FormInput 类型，然后实现 validate 方法。

下面是一个上传器的简单实现示例：

```ts
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
    // label 套一个隐藏的 input
    this.addChild({
      tag: 'input',
      attrs: { type: 'file', accept: opts.accept || '*' },
      style: { display: 'none' },
      postHandle: el => {
        const input = el as HTMLInputElement
        input.onchange = e => {
          // 处理 change 回调
          this.file = input.files && input.files.length ? input.files[0] : undefined
          this.handleChange()
        }
      }
    })
  }

  private handleChange() {
    if (this.opts.onChange) {
      this.opts.onChange(this.file)
    }
    this.validate()
  }

  /**
   * 内部校验，仅校验值
   */
  private __validate(): { valid: false; errmsg: string } | { valid: true } {
    if (!this.file) {
      if (this.opts.required) {
        return { valid: false, errmsg: '文件必填' }
      } else {
        return { valid: true }
      }
    }
    if (typeof this.opts.max === 'number') {
      if (this.file.size > this.opts.max) {
        return { valid: false, errmsg: '文件过大' }
      }
    }
    return { valid: true }
  }
  /**
   * 实现 FormInput 的 validate 方法，校验并反馈
   * @returns
   */
  validate(): boolean {
    const res = this.__validate()
    // 使用父类 FormInput 提供的
    // hideInvalidFeedback 和 showInvalidFeedback 方法来展示反馈信息
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
