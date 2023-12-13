import { FormInput } from '../form-input';
export interface RangeOpts {
    /**
     * 默认值
     */
    value: number;
    /**
     * 最小值
     */
    min: number;
    /**
     * 最大值
     */
    max: number;
    /**
     * 步进，默认1
     */
    step?: number;
    /**
     * 是否展示值
     */
    showValue?: boolean;
    /**
     * 变化监听
     * @param val
     * @returns
     */
    onChange?: (val: number) => void;
}
export declare class Range extends FormInput {
    #private;
    constructor(opts: RangeOpts);
    validate(): boolean;
    setDisabled(disabled: boolean): void;
}
