import { DivModule } from './module'
import { rem } from './size'
/**
 * 垫片，用于增加垂直方向的间隙
 */
export class Spacer extends DivModule {
  /**
   * @param height 高度，可以是具体的数字或预设值。normal 为默认高度 1rem，sm 为较小的高度 0.5rem，
   * lg 为较大的高度 2rem
   */
  constructor(height?: number | 'normal' | 'sm' | 'lg') {
    super()
    let finalHeight = rem(1)
    if (height === 'sm') {
      finalHeight = rem(0.5)
    } else if (height === 'lg') {
      finalHeight = rem(2)
    } else if (typeof height === 'number') {
      finalHeight = height
    }
    this.el.style.height = `${finalHeight}px`
  }
}
/**
 * 水平方向的垫片
 */
export class HSpacer extends DivModule {
  /**
   *
   * @param width 宽度.可以是具体的数字或预设值。normal 为默认 1rem，sm 为较小的宽度 0.5rem，
   * lg 为较大的宽度 2rem。
   */
  constructor(width?: number | 'normal' | 'sm' | 'lg') {
    super()
    let finalWidth = rem(1)
    if (width === 'sm') {
      finalWidth = rem(0.5)
    } else if (width === 'lg') {
      finalWidth = rem(2)
    } else if (typeof width === 'number') {
      finalWidth = width
    }
    this.el.style.display = 'inline-block'
    this.el.style.width = `${finalWidth}px`
    this.el.style.margin = '0'
  }
}
