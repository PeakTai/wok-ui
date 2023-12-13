import { ConvertibleModule, Module } from '../module';
/**
 * 链接.
 */
export declare class Link extends Module {
    constructor(opts: {
        /**
         * 内容.
         */
        content: ConvertibleModule;
        /**
         * 地址.
         */
        url?: string;
        /**
         * 点击回调.
         */
        onClick?: (ev: MouseEvent) => void;
        /**
         * 目标.
         */
        target?: 'self' | 'blank' | 'parent' | 'top';
        /**
         * 下载名称.
         */
        download?: string;
    });
    /**
     * 触发点击，适用于一些特殊情况.
     * 注意：浏览器有可能不兼容，最好还是让用户主动点击.
     */
    triggerClick(): Link;
}
