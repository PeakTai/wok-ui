import {
  BoolCheckbox,
  Button,
  CheckboxGroup,
  ColorInput,
  DateInput,
  Form,
  FullRenderingModule,
  HBox,
  LargeTitle,
  Link,
  NumberInput,
  PrimaryBodyText,
  RadioGroup,
  Range,
  Select,
  Spacer,
  TextArea,
  TextInput,
  ValidateResult,
  createDomModule,
  rem,
  showModal
} from '../lib'
import { TestLayout } from './layout'

class Page extends FullRenderingModule {
  private form: {
    name: string
    age?: number
    entryDate?: Date
    district: string
    street: string
    edudition: string
    skills?: string[]
    aggree: boolean
    score: number
    color: string
    intro?: string
  } = {
    name: '',
    age: 30,
    district: '徐家汇',
    street: '',
    edudition: '',
    aggree: false,
    score: 5,
    color: ''
  }

  constructor() {
    super()
    this.render()
  }
  protected buildContent(): void {
    let entryDataInput: DateInput
    let streetSelect: Select
    this.addChild(
      new LargeTitle('表单'),
      new Spacer(20),
      new Form({
        onSubmit: () => this.handleSubmit(),
        children: [
          new PrimaryBodyText('姓名'),
          new Spacer('sm'),
          new TextInput({
            autofocus: true,
            required: true,
            value: this.form.name,
            placeholder: '请输入姓名,2-32字符',
            minLength: 2,
            maxLength: 32,
            validator: this.checkName,
            onChange: val => {
              this.form.name = val
              // 与入职日期联动,不输入姓名,入职日期就禁用
              // 这个变化可能非常的频繁,不要全量渲染
              entryDataInput.setDisabled(!this.form.name)
            }
          }),
          new Spacer(),
          new PrimaryBodyText('年龄'),
          new Spacer('sm'),
          new NumberInput({
            value: this.form.age,
            placeholder: '请输入年龄,6-60',
            min: { min: 6, errMsg: '不能小于6岁哦' },
            max: 60,
            required: true,
            onChange: val => (this.form.age = val)
          }),
          new Spacer(),
          new PrimaryBodyText('入职日期 (必须先输入姓名) '),
          new Spacer('sm'),
          (entryDataInput = new DateInput({
            value: this.form.entryDate,
            placeholder: '请输入入职时间, 90 年到 23 年之间',
            disabled: !this.form.name,
            min: new Date('1990/01/01'),
            max: new Date('2023/12/12'),
            required: true,
            onChange: val => (this.form.entryDate = val)
          })),
          new Spacer(),
          new PrimaryBodyText('个人介绍，100-500字'),
          new Spacer('sm'),
          new TextArea({
            value: this.form.intro,
            minLength: 100,
            maxLength: 500,
            placeholder: '请输入介绍信息',
            rows: 3,
            onChange: val => (this.form.intro = val)
          }),
          new Spacer(),
          new PrimaryBodyText('行政区'),
          new Spacer('sm'),
          new Select({
            value: this.form.district,
            required: true,
            options: [
              { label: '-- 请选择 --', value: '' },
              { label: '徐家汇', value: '徐家汇' },
              { label: '长宁区', value: '长宁区' },
              { label: '陆家嘴', value: '陆家嘴' }
            ],
            onChange: val => {
              // 联动,改变街道的选项
              this.form.district = val
              // 可以全量渲染,也可以局部替换,为了减少渲染这里使用局部替换
              const newStreetSelect = this.buildStreetSelect()
              streetSelect.replaceBy(newStreetSelect)
              streetSelect = newStreetSelect
            }
          }),
          new Spacer(),
          new PrimaryBodyText('街道'),
          new Spacer('sm'),
          (streetSelect = this.buildStreetSelect()),
          new Spacer(),
          new PrimaryBodyText('颜色偏好'),
          new Spacer('sm'),
          new ColorInput({
            value: this.form.color,
            required: true,
            onChange: val => (this.form.color = val)
          }),
          new Spacer(),
          new PrimaryBodyText('受教育程度'),
          new Spacer('sm'),
          new RadioGroup({
            value: this.form.edudition,
            inline: true,
            options: [
              { label: '小学', value: 'primary school' },
              { label: '初中', value: 'junior high school' },
              { label: '高中', value: 'high school' },
              { label: '专科', value: 'junior college' },
              { label: '本科', value: 'bachelor' }
            ],
            onChange: val => (this.form.edudition = val)
          }),
          new Spacer(),
          new PrimaryBodyText('技能（选择1-3个）'),
          new Spacer('sm'),
          new CheckboxGroup({
            value: this.form.skills,
            inline: true,
            minSelected: 2,
            maxSelected: 3,
            options: [
              { label: 'Java', value: 'Java' },
              { label: 'Html', value: 'Html' },
              { label: 'Css', value: 'Css' },
              { label: 'Javascript', value: 'Javascript' },
              { label: 'Nodejs', value: 'Nodejs' },
              { label: 'golang', value: 'golang' },
              { label: 'python', value: 'python' },
              { label: 'rust', value: 'rust' },
              { label: 'c', value: 'c' },
              { label: 'c++', value: 'c++' },
              { label: 'c#', value: 'c#' }
            ],
            onChange: vals => (this.form.skills = vals)
          }),
          new Spacer(),
          new PrimaryBodyText('服务评分'),
          new Spacer('sm'),
          new Range({ min: 1, max: 10, showValue: true, value: this.form.score }),
          new Spacer(),
          new BoolCheckbox({
            required: true,
            value: this.form.aggree,
            label: { children: ['同意隐私协议条款， ', new Link({ content: '查看隐私协议' })] },
            onChange: value => (this.form.aggree = value)
          }),
          new Spacer(),
          new HBox({
            gap: rem(1),
            children: [
              new Button({
                type: 'primary',
                formType: 'submit',
                text: '提交'
              }),
              new Button({
                text: '返回',
                onClick: () => history.back()
              })
            ]
          })
        ]
      })
    )
  }

  private buildStreetSelect() {
    return new Select({
      value: this.form.street,
      options: this.form.district
        ? [
            { label: `-- 请选择 --`, value: '' },
            { label: `${this.form.district}-街道一`, value: '街道一' },
            { label: `${this.form.district}-街道二`, value: '街道二' },
            { label: `${this.form.district}-街道三`, value: '街道三' }
          ]
        : [{ label: `-- 请选择 --`, value: '' }],
      onChange: val => {
        if (val) {
          this.form.street = val
        }
      }
    })
  }

  private handleSubmit() {
    showModal({
      title: '表单提交数据',
      body: createDomModule({
        tag: 'pre',
        style: { overflow: 'auto' },
        innerText: JSON.stringify(this.form, undefined, 2)
      })
    })
  }

  private checkName(name: string): ValidateResult {
    if (name.match(/\s/)) {
      return { valid: false, msg: '名称里不能有空格' }
    }
    return { valid: true }
  }
}

export function formTest() {
  return new TestLayout(new Page())
}
