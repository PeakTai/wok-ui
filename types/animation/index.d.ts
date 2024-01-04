/**
 * 动画名称.
 */
export declare enum Animation {
    /**
     * 淡入.
     */
    FADE = "animation-fade",
    /**
     * 放大进入.
     */
    SCALE_UP = "animation-scale-up",
    /**
     * 缩小.
     */
    SCALE_DOWN = "animation-scale-down",
    /**
     * 从顶部滑入.
     */
    SLIDE_TOP = "animation-slide-top",
    /**
     * 从底部滑入.
     */
    SLIDE_BOTTOM = "animation-slide-bottom",
    /**
     * 从左侧滑入.
     */
    SLIDE_LEFT = "animation-slide-left",
    /**
     * 从右侧滑入.
     */
    SLIDE_RIGHT = "animation-slide-right",
    /**
     * 摇晃.
     */
    SHAKE = "animation-shake"
}
/**
 * 预备动画, 如果是做入场动画, 可以在元素生成时就添加到元素的 class 中.
 * 这样可以防止元素先显示出来,然后又以动画入场,导致画面有闪烁感.
 */
export declare const ANIMATION_PROVISION = "animation-provision";
/**
 * 执行动画.
 */
export declare function animate(opts: {
    /**
     * 元素
     */
    el: HTMLElement;
    /**
     * 动画
     */
    animation: Animation | Animation[];
    /**
     * 是否反向
     */
    reverse?: boolean;
    /**
     * 持续时间,单位毫秒，默认 500
     */
    duration?: number;
}): Promise<void>;
