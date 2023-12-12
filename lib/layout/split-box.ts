import { ConvertibleModule, DivModule, Module } from '../module'
import './split-box.less'

/**
 * 分隔盒子，将内容分隔成左右两部分或上下两部分，其中一部分固定空间，另一部分占满剩余的空间.
 */
export class VSplitBox extends DivModule {
  constructor(opts: {
    /**
     * 高度
     */
    height: number
    /**
     * 上边
     */
    top: ConvertibleModule
    /**
     * 下边
     */
    bottom: ConvertibleModule
    /**
     * 要固定的一侧，另一侧占满剩余的空间，固定的一侧模块需要有固定的高度
     */
    fixedSide: 'top' | 'bottom'
    /**
     * 点击事件绑定
     * @param ev
     * @returns
     */
    onClick?: (ev: MouseEvent) => void
  }) {
    super('wok-ui-v-split-box')
    this.el.style.height = `${opts.height}px`
    if (opts.fixedSide === 'top') {
      this.el.classList.add('fix-top')
    } else {
      this.el.classList.add('fix-bottom')
    }
    // 内容
    this.addChild(opts.top, opts.bottom)
    // 点击
    if (opts.onClick) {
      this.el.style.cursor = 'pointer'
      this.el.addEventListener('click', opts.onClick)
    }
  }
}

/**
 * 横向分隔盒子，其中一侧固定宽度，另一侧占满剩余的横向空间.
 */
export class HSplitBox extends DivModule {
  constructor(opts: {
    /**
     * 左侧
     */
    left: ConvertibleModule
    /**
     * 右侧
     */
    right: ConvertibleModule
    /**
     * 间隙
     */
    gap?: number
    /**
     * 内容对齐方式
     */
    align?: 'center' | 'top' | 'bottom' | 'stretch'
    /**
     * 要固定的一侧，另一侧占满剩余的空间，固定的一侧模块需要有固定的宽度
     */
    fixedSide: 'left' | 'right'
    /**
     * 点击事件绑定
     * @param ev
     * @returns
     */
    onClick?: (ev: MouseEvent) => void
  }) {
    super('wok-ui-h-split-box')
    switch (opts.fixedSide) {
      case 'left':
        this.el.classList.add('fix-left')
        break
      case 'right':
        this.el.classList.add('fix-right')
        break
    }
    // 对齐方式
    if (opts.align) {
      switch (opts.align) {
        case 'center':
          this.el.style.alignItems = 'center'
          break
        case 'top':
          this.el.style.alignItems = 'start'
          break
        case 'bottom':
          this.el.style.alignItems = 'end'
          break
        default:
          this.el.style.alignItems = 'stretch'
          break
      }
    }
    // 间隙
    if (opts.gap && opts.gap > 0) {
      this.el.style.gap = `${opts.gap}px`
    }
    // 内容
    this.addChild(opts.left, opts.right)
    // 点击
    if (opts.onClick) {
      this.el.style.cursor = 'pointer'
      this.el.addEventListener('click', opts.onClick)
    }
  }
}
