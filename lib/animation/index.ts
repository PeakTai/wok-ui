// 基础 css 动画，全局适用
import './animation.less'
import './fade.less'
import './scale-up.less'
import './scale-down.less'
import './slide-top.less'
import './slide-bottom.less'
import './slide-left.less'
import './slide-right.less'
import './shake.less'

/**
 * 动画名称.
 */
export enum Animation {
  /**
   * 淡入.
   */
  FADE = 'animation-fade',
  /**
   * 放大进入.
   */
  SCALE_UP = 'animation-scale-up',
  /**
   * 缩小.
   */
  SCALE_DOWN = 'animation-scale-down',
  /**
   * 从顶部滑入.
   */
  SLIDE_TOP = 'animation-slide-top',
  /**
   * 从底部滑入.
   */
  SLIDE_BOTTOM = 'animation-slide-bottom',
  /**
   * 从左侧滑入.
   */
  SLIDE_LEFT = 'animation-slide-left',
  /**
   * 从右侧滑入.
   */
  SLIDE_RIGHT = 'animation-slide-right',
  /**
   * 摇晃.
   */
  SHAKE = 'animation-shake'
}

/**
 * 预备动画, 如果是做入场动画, 可以在元素生成时就添加到元素的 class 中.
 * 这样可以防止元素先显示出来,然后又以动画入场,导致画面有闪烁感.
 */
export const ANIMATION_PROVISION = 'animation-provision'

/**
 * 反转，将动画反转执行.比如动画本来是从顶部进入的，反转后成为从顶部退出.
 */
const ANIMATION_REVERSE = 'animation-reverse'
/**
 * 执行动画.
 */
export async function animate(opts: {
  /**
   * 元素
   */
  el: HTMLElement
  /**
   * 动画
   */
  animation: Animation | Animation[]
  /**
   * 是否反向
   */
  reverse?: boolean
  /**
   * 持续时间,单位毫秒
   */
  duration?: number
}) {
  // 删除已有的动态类
  opts.el.classList.remove(...Object.values(Animation), ANIMATION_REVERSE)
  await new Promise<void>(res => {
    setTimeout(() => {
      // 注：requestAnimationFrame 经测试在部分版本的 firefox 上会有问题，动画不能显示出来
      // requestAnimationFrame(() => res())
      res()
    }, 0)
  })
  opts.el.classList.remove(ANIMATION_PROVISION)
  if (opts.duration && opts.duration > 0) {
    opts.el.style.animationDuration = `${opts.duration}ms`
  }
  if (Array.isArray(opts.animation)) {
    opts.el.classList.add(...opts.animation)
  } else {
    opts.el.classList.add(opts.animation)
  }
  if (opts.reverse) {
    opts.el.classList.add(ANIMATION_REVERSE)
  }
  return new Promise<void>((res, rej) => {
    const listener = () => {
      res()
      opts.el.removeEventListener('animationend', listener)
    }
    opts.el.addEventListener('animationend', listener)
  })
}
