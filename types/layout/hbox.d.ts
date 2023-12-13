import { DivModule, SubModulesOpt } from '../module';
/**
 * 水平盒子，用于处理水平方向的布局，子组件从左往右排布，可设置是否换行.
 */
export declare class HBox extends DivModule {
    constructor(opts: {
        /**
         * 间隙，默认水平和垂直都是 5px .垂直间隙仅对包裹换行有效，单行无效.
         */
        gap?: number | {
            row: number;
            column: number;
        };
        /**
         * 子模块.
         */
        children: SubModulesOpt;
        /**
         * 是否缠绕，设置为 true 则子模块太多超出水平空间就会换行.
         */
        wrap?: boolean;
        /**
         * 反转，颠倒.值为 true 时内容将会从右往左排布.
         */
        reverse?: boolean;
        /**
         * 对齐方式,默认居中(center)
         */
        align?: 'center' | 'top' | 'bottom';
        /**
         * 点击事件绑定
         * @param ev
         * @returns
         */
        onClick?: (ev: MouseEvent) => void;
    });
}
