/**
 * 弹出式提示信息 warning success ，不需要用户交互，仅展示，层级比 loading 稍微高一些
 */
/**
 * 显示弹出式消息
 * @param opts
 */
export declare function showToast(opts: {
    /**
     * 类型
     */
    type: 'success' | 'warning';
    /**
     * 消息内容
     */
    text: string;
    /**
     * 持续时间
     */
    duration?: number;
}): void;
/**
 * 显示警告消息
 */
export declare function showWarning(errMsg: any): void;
/**
 * 显示成功消息
 */
export declare function showSuccess(text: string): void;
