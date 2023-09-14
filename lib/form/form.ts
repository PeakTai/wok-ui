import { Module, SubModulesOpt, buildSubModules } from '../module'
import { FormInput } from './form-input'

/**
 * 表单.
 * <FD> 表单绑定的数据类型
 */
export class Form extends Module {
  constructor(
    private readonly opts: {
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
    }
  ) {
    const form = document.createElement('form')
    form.noValidate = true
    form.autocomplete = opts.autocomplete ? 'on' : 'off'
    super(form)
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
      return
    }
    this.opts.onSubmit()
  }
}
