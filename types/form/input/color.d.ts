import { TextInput, TextInputOpts } from './text';
/**
 * 颜色输入框
 */
export declare class ColorInput extends TextInput {
    constructor(colorOpts: Omit<TextInputOpts, 'maxLength' | 'minLength' | 'placeholder' | 'onBlur'>);
}
