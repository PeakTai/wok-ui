import { ConvertibleModule } from '../module';
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
    body: ConvertibleModule;
    /**
     * 关闭事件回调
     */
    onClose?: () => void;
}
export interface Drawer {
    close(): void;
}
/**
 * 在屏幕中展示滑动对话框.
 */
export declare function showDrawer(options: DrawerOpts): Drawer;
