import { ConvertibleModule } from '../../module';
import { FormInput } from '../form-input';
export interface RadioGroupOpts {
    /**
     * 是否显示为内联样式，默认是 false，表现为一行显示一个条目
     */
    inline?: boolean;
    /**
     * 值
     */
    value?: string;
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
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 监听变化.
     */
    onChange?: (val: string) => void;
}
export declare class RadioGroup extends FormInput {
    private readonly opts;
    private name;
    private value;
    constructor(opts: RadioGroupOpts);
    private __validate;
    validate(): boolean;
    setDisabled(disabled: boolean): void;
}
