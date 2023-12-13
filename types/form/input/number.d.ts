import { TextInput, ValidateResult } from './text';
export interface NumberInputOpts {
    /**
     * 是否必填. 可自定义错误信息
     */
    required?: boolean | string;
    /**
     * 最大值
     */
    max?: number | {
        max: number;
        errMsg: string;
    };
    /**
     * 最小值
     */
    min?: number | {
        min: number;
        errMsg: string;
    };
    /**
     * 初始值
     */
    value?: number;
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 占位提示信息
     */
    placeholder?: string;
    /**
     * 尺寸
     */
    size?: 'sm' | 'default' | 'lg';
    /**
     * 自定义校验
     * @param val
     * @returns
     */
    validator?: (val: number) => ValidateResult;
    /**
     * 变化监听
     * @param val
     * @returns
     */
    onChange?: (val?: number) => void;
    /**
     * 监听失去焦点
     */
    onBlur?: () => void;
}
/**
 * 文本输入框
 */
export declare class NumberInput extends TextInput {
    constructor(numOpts: NumberInputOpts);
}
