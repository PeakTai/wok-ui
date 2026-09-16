import { Button, DivModule, Form, Spacer, TextInput, showDrawer } from 'wok-ui'

/**
 * 抽屉内嵌表单，打开后自动聚焦
 */
export default class DrawerWithFormDemo extends DivModule {
  constructor() {
    super()
    this.addChild(
      new Button({
        text: 'Open',
        onClick() {
          let input: TextInput
          showDrawer({
            title: 'Embedded Form',
            placement: 'right',
            body: new Form({
              children: [
                'Please enter your phone number',
                new Spacer('sm'),
                (input = new TextInput({
                  placeholder: 'No more than 15 characters',
                  required: true,
                  maxLength: 15
                })),
                new Spacer(),
                new Button({ text: 'Next', type: 'primary', formType: 'submit' })
              ]
            }),
            onShown() {
              input.focus()
            }
          })
        }
      })
    )
  }
}
