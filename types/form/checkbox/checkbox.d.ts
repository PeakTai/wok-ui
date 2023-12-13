import { Module } from '../../module';
/**
 * 多选框状态
 */
export type CheckboxStatus = 'checked' | 'unchecked' | 'indeterminate';
/**
 * 基础的勾选框.
 */
export declare class Checkbox extends Module {
    #private;
    readonly value: string;
    constructor(opts: {
        /**
         * 绑定值.
         */
        value: string;
        /**
         * 初始状态
         */
        status?: CheckboxStatus;
        /**
         * 禁用
         */
        disabled?: boolean;
        /**
         * 变化回调
         * @param checked
         * @returns
         */
        onChange?: (status: CheckboxStatus) => void;
    });
    /**
     * 设置状态
     * @param status
     * @returns
     */
    setStatus(status: CheckboxStatus): void;
    getStatus(): CheckboxStatus;
    isChecked(): boolean;
    setDisabled(disabled: boolean): void;
}
