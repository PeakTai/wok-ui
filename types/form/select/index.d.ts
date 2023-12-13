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
     * 默认值
     */
    value?: string;
    /**
     * 选项
     */
    options: Array<{
        label: string;
        value: string;
    }>;
    /**
     * 变化监听
     * @param val
     * @returns
     */
    onChange?: (val: string) => void;
}
export declare class Select extends FormInput {
    #private;
    constructor(opts: SelectOpts);
    validate(): boolean;
    setDisabled(disabled: boolean): void;
}
