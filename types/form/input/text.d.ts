import { FormInput } from '../form-input';
export type ValidateResult = {
    valid: true;
} | {
    valid: false;
    msg: string;
};
export interface TextInputOpts {
    /**
     * 是否必填. 可自定义错误信息
     */
    required?: boolean | string;
    /**
     * 最大长度
     */
    maxLength?: number | {
        maxLength: number;
        errMsg: string;
    };
    /**
     * 最小长度
     */
    minLength?: number | {
        minLength: number;
        errMsg: string;
    };
    /**
     * 初始值
     */
    value?: string;
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
    validator?: (val: string) => ValidateResult;
    /**
     * 变化监听
     * @param val
     * @returns
     */
    onChange?: (val: string) => void;
    /**
     * 监听失去焦点
     */
    onBlur?: () => void;
    /**
     * 自动获取焦点
     */
    autofocus?: boolean;
}
/**
 * 文本输入框
 */
export declare class TextInput extends FormInput {
    private readonly opts;
    /**
     * 组合中，true 表示输入法正在输入中.中文输入时，在备选文字没有上屏时，输入框里是拼音字母，我们不希望输入每按一下按键，
     * 带有拼音字母的内容也回调，这样可能会导致回调过于频繁.
     */
    private composing;
    protected input: HTMLInputElement;
    constructor(opts: TextInputOpts);
    mount(parentEl: Element): void;
    focus(): void;
    private handleChange;
    private __validate;
    validate(): boolean;
    setDisabled(disabled: boolean): void;
}
