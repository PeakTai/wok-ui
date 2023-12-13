import { FormInput } from '../form-input';
import { TextInputOpts } from './text';
/**
 * 多行文本
 *
 * 与 TextInput 重复代码过多，以后有机会重构下，减少重复
 */
export declare class TextArea extends FormInput {
    #private;
    constructor(opts: TextInputOpts & {
        rows?: number;
    });
    validate(): boolean;
    setDisabled(disabled: boolean): void;
}
