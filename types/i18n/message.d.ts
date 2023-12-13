/**
 * 消息
 */
export interface I18nMessages {
    /**
     * 取消
     */
    cancel: string;
    /**
     * 确定
     */
    confirm: string;
    /**
     * 表单错误信息：必填
     */
    'form-err-required': string;
    /**
     * 必须勾选
     */
    'form-err-must-check': string;
    /**
     * 表单错误信息：数字类型
     */
    'form-err-number': string;
    /**
     * 表单错误信息：最小值，不得小于 x
     */
    'form-err-min': string;
    /**
     * 表单错误信息：最大值，不得大于 x
     */
    'form-err-max': string;
    /**
     * 表单错误信息：最多选项 x 项
     */
    'form-err-max-select': string;
    /**
     * 表单错误信息：最小选择 x 项
     */
    'form-err-min-select': string;
    /**
     * 表单错误信息：最大长度，最多可以输入 x 个字符
     */
    'form-err-max-length': string;
    /**
     * 表单错误信息：最小长度，最少输入 x 个字符
     */
    'form-err-min-length': string;
}
