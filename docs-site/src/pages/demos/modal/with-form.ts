import { Button, DivModule, Form, Spacer, TextInput, showModal, showSuccess } from 'wok-ui'

/**
 * 内嵌表单的模态框：onShown 自动聚焦，confirm 触发表单提交
 */
export default class ModalWithFormDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new Button({
        text: 'Show Modal',
        onClick() {
          let input: TextInput
          let form: Form
          const modal = showModal({
            dialogCentered: true,
            title: 'Comment',
            body: (form = new Form({
              onSubmit() {
                showSuccess('Submitted successfully')
                modal.close()
              },
              children: [
                'Comment content',
                new Spacer('sm'),
                (input = new TextInput({
                  placeholder: '2 to 32 characters',
                  required: true,
                  minLength: 2,
                  maxLength: 32
                }))
              ]
            })),
            onShown() {
              input.focus()
            },
            buttons: {
              confirm: 'Submit',
              cancel: true
            },
            onConfirm() {
              form.submit()
            }
          })
        }
      })
    )
  }
}
