import { ConvertibleModule } from '../../module';
import { FormInput } from '../form-input';
/**
 * 选项.
 */
export interface CheckboxGroupOpts {
    /**
     * 是否显示为内联样式，默认是 false，表现为一行显示一个条目
     */
    inline?: boolean;
    /**
     * 值
     */
    value?: string[];
    /**
     * 选项
     */
    options: Array<{
        label: ConvertibleModule;
        value: string;
    }>;
    /**
     * 是否必填. 可自定义错误信息
     */
    required?: boolean | string;
    /**
     * 最小选择数量
     */
    minSelected?: number | {
        minSelected: number;
        errMsg: string;
    };
    /**
     * 最大选择数量
     */
    maxSelected?: number | {
        maxSelected: number;
        errMsg: string;
    };
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 监听变化.
     */
    onChange?: (vals: string[]) => void;
}
/**
 * 多选框组.
 */
export declare class CheckboxGroup extends FormInput {
    private readonly opts;
    private __values;
    private __disabled;
    constructor(opts: CheckboxGroupOpts);
    /**
     * 更新勾选框状态，如果达到限制则禁用
     */
    private updateCheckboxStatus;
    private handleChange;
    private __validate;
    validate(): boolean;
    setDisabled(disabled: boolean): void;
}
