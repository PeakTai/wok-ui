// 综合表单示例：内置输入控件、校验规则、下拉联动与提交数据展示
import {
  BoolCheckbox,
  Button,
  CheckboxGroup,
  ColorInput,
  DateInput,
  DivModule,
  Form,
  HBox,
  NumberInput,
  RadioGroup,
  Range,
  Select,
  Spacer,
  TextArea,
  TextInput,
  createDomModule,
  rem,
  showModal,
  showSuccess,
  showWarning
} from 'wok-ui'

export default class FullFormDemo extends DivModule {
  private readonly data = {
    name: '',
    age: undefined as number | undefined,
    entryDate: undefined as Date | undefined,
    intro: '',
    district: '',
    street: '',
    color: '',
    education: '',
    skills: [] as string[],
    score: 5,
    agree: false
  }

  constructor() {
    super()
    let form: Form
    let streetSelect = this.buildStreetSelect()
    this.addChild(
      (form = new Form({
        onSubmit: () => this.handleSubmit(),
        children: [
          'Name',
          new Spacer('sm'),
          new TextInput({
            value: this.data.name,
            required: true,
            minLength: 2,
            maxLength: 32,
            placeholder: 'Enter name, 2-32 characters',
            onChange: val => {
              this.data.name = val
            }
          }),
          new Spacer(),
          'Age',
          new Spacer('sm'),
          new NumberInput({
            value: this.data.age,
            min: 6,
            max: 60,
            placeholder: 'Enter age, 6-60',
            onChange: val => {
              this.data.age = val
            }
          }),
          new Spacer(),
          'Entry Date',
          new Spacer('sm'),
          new DateInput({
            value: this.data.entryDate,
            min: new Date('1990/01/01'),
            max: new Date('2030/12/31'),
            placeholder: 'Pick a date',
            onChange: val => {
              this.data.entryDate = val
            }
          }),
          new Spacer(),
          'Introduction',
          new Spacer('sm'),
          new TextArea({
            value: this.data.intro,
            maxLength: 500,
            autoHeight: true,
            rows: 3,
            placeholder: 'Tell us about yourself',
            onChange: val => {
              this.data.intro = val
            }
          }),
          new Spacer(),
          'District',
          new Spacer('sm'),
          new Select({
            value: this.data.district,
            required: true,
            options: [{ label: '-- Select --', value: '' }, 'Downtown', 'Uptown', 'Suburb'],
            onChange: val => {
              // 联动：重建街道下拉框的选项
              this.data.district = val
              this.data.street = ''
              const newStreet = this.buildStreetSelect()
              streetSelect.replaceBy(newStreet)
              streetSelect = newStreet
            }
          }),
          new Spacer(),
          'Street',
          new Spacer('sm'),
          streetSelect,
          new Spacer(),
          'Favorite Color',
          new Spacer('sm'),
          new ColorInput({
            value: this.data.color,
            onChange: val => {
              this.data.color = val
            }
          }),
          new Spacer(),
          'Education',
          new Spacer('sm'),
          new RadioGroup({
            value: this.data.education,
            inline: true,
            options: [
              { label: 'High School', value: 'high-school' },
              { label: 'Bachelor', value: 'bachelor' },
              { label: 'Master', value: 'master' },
              { label: 'PhD', value: 'phd' }
            ],
            onChange: val => {
              this.data.education = val
            }
          }),
          new Spacer(),
          'Skills (pick 1-3)',
          new Spacer('sm'),
          new CheckboxGroup({
            value: this.data.skills,
            inline: true,
            minSelected: 1,
            maxSelected: 3,
            options: [
              { label: 'Java', value: 'Java' },
              { label: 'JavaScript', value: 'JavaScript' },
              { label: 'CSS', value: 'CSS' },
              { label: 'Node.js', value: 'Node.js' },
              { label: 'Go', value: 'Go' },
              { label: 'Python', value: 'Python' },
              { label: 'Rust', value: 'Rust' }
            ],
            onChange: vals => {
              this.data.skills = vals
            }
          }),
          new Spacer(),
          'Score',
          new Spacer('sm'),
          new Range({
            min: 1,
            max: 10,
            showValue: true,
            value: this.data.score,
            onChange: val => {
              this.data.score = val
            }
          }),
          new Spacer(),
          new BoolCheckbox({
            required: true,
            value: this.data.agree,
            label: 'I agree to the terms of service',
            onChange: val => {
              this.data.agree = val
            }
          }),
          new Spacer(),
          new HBox({
            gap: rem(1),
            children: [
              new Button({
                type: 'primary',
                formType: 'submit',
                text: 'Submit'
              }),
              new Button({
                type: 'default',
                text: 'Validate',
                onClick: () => {
                  if (form.validate()) {
                    showSuccess('Validation passed')
                  } else {
                    showWarning('Validation failed')
                  }
                }
              })
            ]
          })
        ]
      }))
    )
  }

  private buildStreetSelect(): Select {
    return new Select({
      value: this.data.street,
      options: this.data.district
        ? [
            { label: '-- Select --', value: '' },
            `${this.data.district} Street 1`,
            `${this.data.district} Street 2`,
            `${this.data.district} Street 3`
          ]
        : [{ label: '-- Select --', value: '' }],
      onChange: val => {
        this.data.street = val
      }
    })
  }

  private handleSubmit() {
    showModal({
      title: 'Submitted Data',
      body: createDomModule({
        tag: 'pre',
        style: { overflow: 'auto' },
        innerText: JSON.stringify(this.data, undefined, 2)
      })
    })
  }
}
