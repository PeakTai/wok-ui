import { Module } from '../module'
import { Form } from './form'

/**
 * 表单输入
 */
export abstract class FormInput extends Module {
  /**
   * 校验，如果校验不通过，会有提示
   */
  abstract validate(): boolean
}
