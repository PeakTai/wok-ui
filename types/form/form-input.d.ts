import { Module } from '../module';
/**
 * 表单输入
 */
export declare abstract class FormInput extends Module {
    /**
     * 校验，如果校验不通过，会有提示
     */
    abstract validate(): boolean;
}
