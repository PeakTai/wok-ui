import {
  BoolCheckbox,
  Button,
  CheckboxGroup,
  ColorInput,
  DateInput,
  FileInput,
  Form,
  FullRenderingModule,
  HBox,
  LargeTitle,
  Link,
  NumberInput,
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
  private readonly setting = {
    autoComplete: false,
    feedbackTooltip: false
  }
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
    files: string[]
  } = {
    name: '',
    age: 30,
    district: '徐家汇',
    street: '',
    edudition: '',
    skills: ['Java', 'Html', 'Css', 'Javascript'],
    aggree: false,
    score: 5,
    color: '',
    files: []
  }

  /**
   * 渲染的时候是否应该让名称自动获取焦点
   */
  private nameAutoFocus = true

  constructor() {
    super()
    this.render()
  }
  protected buildContent(): void {
    this.addChild(
      new LargeTitle('表单'),
      new Spacer(20),
      new HBox({
        gap: rem(1),
        children: [
          new BoolCheckbox({
            label: '自动完成',
            value: this.setting.autoComplete,
            onChange: value => {
              this.setting.autoComplete = value
              this.render()
            }
          }),
          new BoolCheckbox({
            label: '悬浮显示反馈信息',
            value: this.setting.feedbackTooltip,
            onChange: value => {
              this.setting.feedbackTooltip = value
              this.render()
            }
          })
        ]
      }),
      createDomModule({ tag: 'hr' }),
      new Spacer(20),
      new Form({
        autocomplete: this.setting.autoComplete,
        feedbackMode: this.setting.feedbackTooltip ? 'tooltip' : 'inline',
        onSubmit: () => this.handleSubmit(),
        children: add => {
          add(
            '姓名',
            new Spacer('sm'),
            new TextInput({
              autofocus: this.nameAutoFocus,
              required: true,
              value: this.form.name,
              placeholder: '请输入姓名,2-32字符',
              minLength: 2,
              maxLength: 32,
              validator: this.checkName,
              onChange: val => {
                const oHasValue = !!this.form.name
                this.form.name = val
                const nHasValue = !!this.form.name
                // 姓名的值影响日期，如果以生变化，在恰当的时候重新渲染
                if (oHasValue !== nHasValue) {
                  // 重新渲染，让名称获取焦点，保持输入不间断
                  this.nameAutoFocus = true
                  this.render()
                }
              }
            }),
            new Spacer(),
            '年龄',
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
            '入职日期 (必须先输入姓名) ',
            new Spacer('sm'),
            new DateInput({
              value: this.form.entryDate,
              placeholder: '请输入入职时间, 90 年到 23 年之间',
              disabled: !this.form.name,
              min: new Date('1990/01/01'),
              max: new Date('2023/12/12'),
              required: true,
              onChange: val => (this.form.entryDate = val)
            }),
            new Spacer(),
            '个人介绍，100-500字',
            new Spacer('sm'),
            new TextArea({
              value: this.form.intro,
              minLength: 100,
              maxLength: 500,
              autoHeight: true,
              placeholder: '请输入介绍信息',
              rows: 3,
              onChange: val => {
                this.form.intro = val
              }
            }),
            new Spacer(),
            '行政区',
            new Spacer('sm'),
            new Select({
              value: this.form.district,
              required: true,
              options: [{ label: '-- 请选择 --', value: '' }, '徐家汇', '长宁区', '陆家嘴'],
              onChange: val => {
                // 联动,改变街道的选项
                this.form.district = val
                this.render()
              }
            }),
            new Spacer()
          )
          // 选择了行政区，才显示街道信息
          if (this.form.district) {
            add(
              '街道',
              new Spacer('sm'),
              new Select({
                value: this.form.street,
                options: this.form.district
                  ? [
                      { label: `-- 请选择 --`, value: '' },
                      `${this.form.district}-街道一`,
                      `${this.form.district}-街道二`,
                      `${this.form.district}-街道三`
                    ]
                  : [{ label: `-- 请选择 --`, value: '' }],
                onChange: val => {
                  if (val) {
                    this.form.street = val
                  }
                }
              }),
              new Spacer()
            )
          }
          add(
            '颜色偏好',
            new Spacer('sm'),
            new ColorInput({
              value: this.form.color,
              required: true,
              onChange: val => (this.form.color = val)
            }),
            new Spacer(),
            '受教育程度',
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
            '技能（选择1-3个）',
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
            '服务评分',
            new Spacer('sm'),
            new Range({ min: 1, max: 10, showValue: true, value: this.form.score }),
            new Spacer(),
            '入职资料（相关证件扫描文件）',
            new Spacer('sm'),
            new FileInput({
              multiple: true,
              minSize: 1024 * 1024,
              maxSize: 1024 * 1024 * 10,
              minSelected: 2,
              maxSelected: 5,
              onChange: files => {
                if (files) {
                  this.form.files = Array.from(files).map(f => f.name)
                } else {
                  this.form.files = []
                }
              }
            }),
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
          )
        }
      })
    )
    // 每次渲染后，将 nameAutoFocus 设置为 false，避免再次渲染又让名称获取到焦点
    if (this.nameAutoFocus) {
      this.nameAutoFocus = false
    }
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
