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
}
/**
 * 表单.
 * <FD> 表单绑定的数据类型
 */
export declare class Form extends Module {
    private readonly opts;
    constructor(opts: FormOpts);
    /**
     * 主要请求提交，如果所有表单元素都校验通过，则会触发 submit 事件
     */
    submit(): void;
}
