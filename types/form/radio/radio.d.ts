import { Module } from '../../module';
export declare class Radio extends Module {
    #private;
    constructor(opts: {
        /**
         * 表单的属性名称，用于联动
         */
        name: string;
        /**
         * 绑定值.
         */
        value: string;
        /**
         * 初始状态
         */
        checked?: boolean;
        /**
         * 禁用
         */
        disabled?: boolean;
        /**
         * 选中回调
         * @param checked
         * @returns
         */
        onChecked?: () => void;
    });
    isChecked(): boolean;
    setChecked(checked: boolean): void;
    getValue(): string;
    setDisabled(disabled: boolean): void;
}
