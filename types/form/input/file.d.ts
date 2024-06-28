import { FormInput } from '../form-input';
import { ValidateResult } from './text';
/**
 * 文件输入框选项
 */
export interface FileInputOpts {
    /**
     * 是否必填. 可自定义错误信息
     */
    required?: boolean | string;
    /**
     * 尺寸
     */
    size?: 'sm' | 'default' | 'lg';
    /**
     * 接收类型，默认值为 *（所有）
     */
    accept?: string;
    /**
     * 是否多选
     */
    multiple?: boolean;
    /**
     * 最小选择数量，多选时才有效
     */
    minSelected?: number | {
        minSelected: number;
        errMsg: string;
    };
    /**
     * 最大选择数量，多选时才有效
     */
    maxSelected?: number | {
        maxSelected: number;
        errMsg: string;
    };
    /**
     * 最小文件尺寸（包含所有选择的文件），单位字节
     */
    minSize?: number | {
        minSize: number;
        errMsg: string;
    };
    /**
     * 最大文件尺寸（包含所有选择的文件），单位字节
     */
    maxSize?: number | {
        maxSize: number;
        errMsg: string;
    };
    /**
     * 自定义校验
     * @param val
     * @returns
     */
    validator?: (files: FileList) => ValidateResult;
    /**
     * 更改回调
     * @param files
     * @returns
     */
    onChange?: (files: FileList | null) => void;
}
/**
 * 文件输入框
 */
export declare class FileInput extends FormInput {
    private readonly opts;
    private readonly input;
    constructor(opts: FileInputOpts);
    private __validate;
    private handleChange;
    validate(): boolean;
    /**
     * 格式化文件大小
     * @param size
     * @returns
     */
    private formatFileSize;
    private formatSizeNumber;
}
