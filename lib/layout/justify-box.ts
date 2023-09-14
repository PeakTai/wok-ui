import { DivModule, Module, SubModulesOpt, buildSubModules } from '../module'
import './justify-box.less'

export interface JustifyBoxOpts {
  /**
   * 子模块
   */
  children: SubModulesOpt
  /**
   * 内容对齐方式，默认 stretch （拉伸）
   */
  align?: 'center' | 'top' | 'bottom' | 'stretch'
  /**
   * 点击事件绑定
   * @param ev
   * @returns
   */
  onClick?: (ev: MouseEvent) => void
}

/**
 * 两端对齐盒子，盒子里的内容分页在左右两侧靠边.
 */
export class JustifyBox extends DivModule {
  constructor(opts: JustifyBoxOpts) {
    super('wok-ui-justify-box')
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
      }
    }
    // 内容
    this.addChild(...buildSubModules(opts.children))
    // 点击
    if (opts.onClick) {
      this.el.style.cursor = 'pointer'
      this.el.addEventListener('click', opts.onClick)
    }
  }
}
