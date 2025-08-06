import { FormInput } from '../form-input';
import { TextInputOpts } from './text';
export interface TextAreaOpts extends TextInputOpts {
    /**
     * 默认行数
     */
    rows?: number;
    /**
     * 是否自动高度
     */
    autoHeight?: boolean;
}
/**
 * 多行文本
 *
 * 与 TextInput 重复代码过多，以后有机会重构下，减少重复
 */
export declare class TextArea extends FormInput {
    private readonly textAreaopts;
    /**
     * 组合中，true 表示输入法正在输入中.中文输入时，在备选文字没有上屏时，输入框里是拼音字母，我们不希望输入每按一下按键，
     * 带有拼音字母的内容也回调，这样可能会导致回调过于频繁.
     */
    private composing;
    private textareaEl;
    /**
     * 要处理自动高度逻辑的标识，如果原生 css 不能支持 field-sizing，则需要进行额外的处理
     */
    private handleAutoHeight;
    constructor(textAreaopts: TextAreaOpts);
    mount(parentEl: Element): void;
    focus(): void;
    setValue(value: string): void;
    private handleChange;
    private __validate;
    validate(): boolean;
    setDisabled(disabled: boolean): void;
}
