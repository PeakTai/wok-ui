import { ConvertibleModule } from '../../module';
import { FormInput } from '../form-input';
/**
 * 布尔勾选框选项
 */
export interface BoolCheckboxOpts {
    /**
     * 初始值
     */
    value?: boolean;
    /**
     * 必填，也说是必须勾选
     */
    required?: boolean | string;
    /**
     * 勾选框的标题
     */
    label: ConvertibleModule;
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 变化回调
     * @param value
     * @returns
     */
    onChange?: (value: boolean) => void;
}
/**
 * 布尔勾选框，绑定布尔值，功能和 switch 组件一致
 */
export declare class BoolCheckbox extends FormInput {
    private readonly opts;
    private __value;
    private __disabled;
    constructor(opts: BoolCheckboxOpts);
    private __validate;
    isChecked(): boolean;
    validate(): boolean;
    setDisabled(disabled: boolean): void;
}
