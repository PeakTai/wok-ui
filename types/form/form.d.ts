import { Module, SubModulesOpt } from '../module';
export interface FormOpts {
    /**
     * 监听提交
     * @returns
     */
    onSubmit?: () => void;
    /**
     * 自动完成
     */
    autocomplete?: boolean;
    /**
     * 子元素.
     */
    children: SubModulesOpt;
    /**
     * 校验反馈信息的模式：
     *
     * inline 内联，默认模式，反馈信息会显示成输入框的后面，一般情况下都会换行
     * tooltip 反馈信息以悬浮提示的形式展示在输入框底部
     */
    feedbackMode?: 'inline' | 'tooltip';
}
/**
 * 表单.
 */
export declare class Form extends Module {
    private readonly opts;
    constructor(opts: FormOpts);
    /**
     * 主要请求提交，如果所有表单元素都校验通过，则会触发 submit 事件
     */
    submit(): void;
}
