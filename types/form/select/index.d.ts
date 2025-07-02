import { FormInput } from '../form-input';
export interface SelectOpts {
    /**
     * 尺寸
     */
    size?: 'sm' | 'default' | 'lg';
    /**
     * 必填
     */
    required?: boolean | string;
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 默认值
     */
    value?: string;
    /**
     * 选项
     */
    options: Array<{
        label: string;
        value: string;
    } | string>;
    /**
     * 变化监听
     * @param val
     * @returns
     */
    onChange?: (val: string) => void;
}
export declare class Select extends FormInput {
    private readonly opts;
    private select;
    constructor(opts: SelectOpts);
    private __validate;
    validate(): boolean;
    setDisabled(disabled: boolean): void;
}
