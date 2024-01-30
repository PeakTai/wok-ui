import { Module, SubModulesOpt } from '../module';
/**
 * 模态框选项
 */
export interface ModalOptions {
    /**
     * 标题，无标题不出现头部.
     */
    title?: string;
    /**
     * 是否出现关闭按钮.只在有标题的情况下有效,如果设置为true会在右上角出现关闭图标.默认为 true.
     */
    closeBtn?: boolean;
    /**
     * 对话框居中，如果设置为 true 对话框部分将垂直居中显示，默认出现在顶部.
     * 与全屏选项冲突，不可同时设置为 true ，全屏选项优先.
     */
    dialogCentered?: boolean;
    /**
     * 主体部分.
     */
    body: SubModulesOpt;
    /**
     * 使用 body 部分替换掉整个内容.body 默认会被包裹
     * 在 content 容器中，容器有背景色和内边距，该选项为 true ，则可以完全自定义内容.
     */
    replaceByBody?: boolean;
    /**
     * 静态幕布，如果设置为 true 则点击背景幕布不能关闭模态框.
     */
    staticBackDrop?: boolean;
    /**
     * 全屏.
     */
    fullscreen?: boolean;
    /**
     * 宽度，默认 500px.
     */
    width?: number;
    /**
     * 关闭回调.
     */
    onClose?: () => void;
    /**
     * 确认回调，点击确认按钮后触发
     */
    onConfirm?: () => void;
    /**
     * 自定义脚部，优先级高于按钮.
     */
    footer?: Module;
    /**
     * 自定义圆角大小.
     */
    borderRadius?: number;
    /**
     * 按钮设置，可选，可设置显示按钮或自定义按钮文字，有设置才会显示出来
     */
    buttons?: {
        confirm?: boolean | string;
        cancel?: boolean | string;
    };
    /**
     * 模态框完全显示回调，在模态框入场动画完成后触发
     * @returns
     */
    onShown?: () => void;
}
/**
 * 模态框对象，每次展示模态框后返回一个实例对象，用于关闭打开的模态框.
 */
export interface Modal {
    close(): Promise<void>;
}
/**
 * 显示模态框.
 * @param options
 */
export declare function showModal(options: ModalOptions): Modal;
/**
 * 关闭所有的模态框.
 */
export declare function closeAllModals(): Promise<void>;
