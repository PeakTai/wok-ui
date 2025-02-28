import { SubModulesOpt } from '../module';
export interface DrawerOpts {
    /**
     * 位置，默认是 right．
     */
    placement?: 'left' | 'right' | 'top' | 'bottom';
    /**
     * 标题.
     */
    title?: string;
    /**
     * 内容.
     */
    body: SubModulesOpt;
    /**
     * 使用 body 部分替换掉整个内容.适用于高度自定义的场景.
     */
    replaceByBody?: boolean;
    /**
     * 关闭事件回调
     */
    onClose?: () => void;
    /**
     * 抽屉完全显示回调，在抽屉入场动画完成后触发
     * @returns
     */
    onShown?: () => void;
}
export interface Drawer {
    close(): void;
}
/**
 * 在屏幕中展示滑动对话框.
 */
export declare function showDrawer(options: DrawerOpts): Drawer;
