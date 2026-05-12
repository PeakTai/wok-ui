# Form

The component library provides a complete set of form modules covering common input elements with support for extension.

## Basic Usage

Create a form by constructing a `Form` module instance.

```ts
const formData = {
  name: 'Jack',
  gender: 'Male'
}
// This is just for demonstration. In practice, a Form instance can be inserted anywhere a module type is accepted.
new Form({
  children: [
    'Name:',
    rem(0.5),
    new TextInput({
      value: formData.name,
      // Name is required, length between 2 and 32 characters
      required: true,
      minLength: 2,
      maxLength: 32,
      onChange(val) {
        formData.name = val
      }
    }),
    rem(1),
    'Gender:',
    rem(0.5),
    new RadioGroup({
      value: formData.gender,
      options: [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' }
      ],
      onChange(val) {
        formData.gender = val
      }
    }),
    rem(1),
    // Submit button; clicking triggers form submission
    new Button({
      formType: 'submit',
      text: 'Submit'
    })
  ],
  onSubmit: () => {
    // Handle submit event
    showLoading('Saving...')
    saveData(formData)
      .then(() => showSuccess('Saved successfully'))
      .catch(showWarning)
      .finally(hideLoading)
  }
})
```

The `Form` type does not enforce strict typing on the `children` parameter — any module is allowed. However, only elements implementing the `FormInput` type are treated as form fields. When the form is submitted, all form fields are validated; the submit event fires only when all pass. Data binding is not enforced either — you handle it yourself in the callbacks. This design allows flexibility for complex requirements.

## Built-in Form Modules

The following table lists all built-in form element modules.

| Module Type   | Description                                               |
| :------------ | :-------------------------------------------------------- |
| TextInput     | Text input field                                          |
| TelInput      | Telephone input; shows appropriate keyboard on mobile     |
| SearchInput   | Search input; mobile keyboard shows a search button       |
| PasswordInput | Password input field                                      |
| DateInput     | Date input field                                          |
| ColorInput    | Color input field                                         |
| NumberInput   | Number input field                                        |
| FileInput     | File input field                                          |
| TextArea      | Multi-line text                                           |
| RadioGroup    | Radio button group                                        |
| CheckboxGroup | Checkbox group                                            |
| BoolCheckbox  | Single boolean checkbox; callback value is a boolean      |
| Select        | Dropdown select                                           |
| Range         | Range slider                                              |

## Custom Form Element Modules

To create a custom form element, create a module class that extends `FormInput` and implement the `validate` method.

Below is a simple uploader example:

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
    // Wrap a hidden input inside the label
    this.addChild({
      tag: 'input',
      attrs: { type: 'file', accept: opts.accept || '*' },
      style: { display: 'none' },
      postHandle: el => {
        const input = el as HTMLInputElement
        input.onchange = e => {
          // Handle change callback
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
   * Internal validation — validates the value only
   */
  private __validate(): { valid: false; errmsg: string } | { valid: true } {
    if (!this.file) {
      if (this.opts.required) {
        return { valid: false, errmsg: 'File is required' }
      } else {
        return { valid: true }
      }
    }
    if (typeof this.opts.max === 'number') {
      if (this.file.size > this.opts.max) {
        return { valid: false, errmsg: 'File is too large' }
      }
    }
    return { valid: true }
  }
  /**
   * Implement the FormInput validate method — validates and gives feedback
   * @returns
   */
  validate(): boolean {
    const res = this.__validate()
    // Use the parent class FormInput's
    // hideInvalidFeedback and showInvalidFeedback methods to display feedback
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
