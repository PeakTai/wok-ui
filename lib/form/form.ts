import { Module, SubModulesOpt, buildSubModules } from '../module'
import { FormInput } from './form-input'
import { TextInput } from './input'
import './style.less'

export interface FormOpts {
  /**
   * 监听提交
   * @returns
   */
  onSubmit?: () => void
  /**
   * 自动完成
   */
  autocomplete?: boolean
  /**
   * 子元素.
   */
  children: SubModulesOpt
  /**
   * 校验反馈信息的模式：
   *
   * inline 内联，默认模式，反馈信息会显示成输入框的后面，一般情况下都会换行
   * tooltip 反馈信息以悬浮提示的形式展示在输入框底部
   */
  feedbackMode?: 'inline' | 'tooltip'
}
/**
 * 表单.
 */
export class Form extends Module {
  constructor(private readonly opts: FormOpts) {
    const form = document.createElement('form')
    form.classList.add('wok-ui-form')
    form.noValidate = true
    form.autocomplete = opts.autocomplete ? 'on' : 'off'
    super(form)
    if (opts.feedbackMode === 'tooltip') {
      form.classList.add('feedback-tooltip')
    } else {
      form.classList.add('feedback-inline')
    }
    this.addChild(...buildSubModules(opts.children))
    form.addEventListener('submit', ev => {
      ev.preventDefault()
      this.submit()
    })
  }

  /**
   * 主要请求提交，如果所有表单元素都校验通过，则会触发 submit 事件
   */
  submit() {
    if (!this.opts.onSubmit) {
      return
    }
    const invalidInputs = this.find<FormInput>(m => m instanceof FormInput).filter(
      m => !m.validate()
    )
    if (invalidInputs.length) {
      invalidInputs[0].scrollIntoViewIfInvisible()
      if (invalidInputs[0] instanceof TextInput) {
        invalidInputs[0].focus()
      }
      return
    }
    this.opts.onSubmit()
  }
}
