import { TextInput, TextInputOpts } from './text';
/**
 * 搜索输入框，作用是在移动端时可以让输入法显示搜索按钮，方便用户输入完成后直接提交表单，
 * 部分 pc 浏览器还支持清除内容，在右侧会显示清除按钮
 */
export declare class SearchInput extends TextInput {
    constructor(opts: TextInputOpts);
}
