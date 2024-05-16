import { Module } from '../module';
/**
 * 表单输入
 */
export declare abstract class FormInput extends Module {
    constructor(elOrClass?: HTMLElement | string);
    /**
     * 校验，如果校验不通过，会有提示
     */
    abstract validate(): boolean;
    /**
     * 展示校验无效的反馈信息
     * @param errMsg 错误提示信息
     */
    protected showInvalidFeedback(errMsg: string): void;
    /**
     * 隐藏校验无效的反馈信息
     */
    protected hideInvalidFeedback(): void;
}
