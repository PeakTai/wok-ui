import { DivModule, Module, SubModulesOpt, buildSubModules } from '../module'
import './vbox.less'

export interface VboxOpts {
  /**
   * 间隙
   */
  gap?: number
  /**
   * 子模块内容，支持动态添加
   */
  children: SubModulesOpt
  /**
   * 内容对齐方式，默认 stretch（拉伸占满横向空间）
   */
  align?: 'left' | 'center' | 'right' | 'stretch'
  /**
   * 点击事件绑定
   * @param ev
   * @returns
   */
  onClick?: (ev: MouseEvent) => void
}
/**
 * 垂直盒子，内容将从上往下堆叠.
 */
export class VBox extends DivModule {
  constructor(opts: VboxOpts) {
    super('wok-ui-vbox')
    if (opts.gap && opts.gap > 0) {
      this.el.style.gap = `${opts.gap}px`
    }
    if (opts.align) {
      switch (opts.align) {
        case 'left':
          this.el.style.alignItems = 'start'
          break
        case 'center':
          this.el.style.alignItems = 'center'
          break
        case 'right':
          this.el.style.alignItems = 'end'
          break
        case 'stretch':
          this.el.style.alignItems = 'stretch'
          break
      }
    }
    // children
    this.addChild(...buildSubModules(opts.children))
    // 点击
    if (opts.onClick) {
      this.el.style.cursor = 'pointer'
      this.el.addEventListener('click', opts.onClick)
    }
  }
}
