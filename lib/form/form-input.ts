import { Module } from '../module';
import { InvalidFeedback } from './Invalid-feedback';

/**
 * 表单输入
 */
export abstract class FormInput extends Module {

  constructor(elOrClass?: HTMLElement | string) {
    if (elOrClass) {
      if (typeof elOrClass === 'string') {
        super(document.createElement('div'))
        this.el.classList.add(elOrClass)
      } else {
        super(elOrClass)
      }
    } else {
      super(document.createElement('div'))
    }
    this.el.classList.add('wok-ui-form-input')
  }
  /**
   * 校验，如果校验不通过，会有提示
   */
  abstract validate(): boolean
  /**
   * 展示校验无效的反馈信息
   * @param errMsg 错误提示信息
   */
  protected showInvalidFeedback(errMsg: string) {
    this.hideInvalidFeedback()
    this.addChild(new InvalidFeedback(errMsg))
  }
  /**
   * 隐藏校验无效的反馈信息
   */
  protected hideInvalidFeedback() {
    this.getChildren().filter(m => m instanceof InvalidFeedback).map(m => m as InvalidFeedback).forEach(m => m.destroy())
  }
}
