import { TextInput } from './text';
export interface DateInputOpts {
    /**
     * 是否必填. 可自定义错误信息
     */
    required?: boolean | string;
    /**
     * 最大值
     */
    max?: Date | {
        max: Date;
        errMsg: string;
    };
    /**
     * 最小值
     */
    min?: Date | {
        min: Date;
        errMsg: string;
    };
    /**
     * 初始值
     */
    value?: Date;
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
     * 变化监听
     * @param val
     * @returns
     */
    onChange?: (val?: Date) => void;
    /**
     * 监听失去焦点
     */
    onBlur?: () => void;
}
export declare class DateInput extends TextInput {
    constructor(dateOpts: DateInputOpts);
}
