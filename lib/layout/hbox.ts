import { DivModule, SubModulesOpt, buildSubModules } from '../module';

/**
 * 水平盒子，用于处理水平方向的布局，子组件从左往右排布，可设置是否换行.
 */
export class HBox extends DivModule {
  constructor(opts: {
    /**
     * 间隙，默认水平和垂直都是 5px .垂直间隙仅对包裹换行有效，单行无效.
     */
    gap?: number | { row: number; column: number }
    /**
     * 子模块.
     */
    children: SubModulesOpt
    /**
     * 是否缠绕，设置为 true 则子模块太多超出水平空间就会换行.
     */
    wrap?: boolean
    /**
     * 反转，颠倒.值为 true 时内容将会从右往左排布.
     */
    reverse?: boolean
    /**
     * 对齐方式,默认居中(center)
     */
    align?: 'center' | 'top' | 'bottom'
    /**
     * 点击事件绑定
     * @param ev
     * @returns
     */
    onClick?: (ev: MouseEvent) => void
  }) {
    super('wok-ui-hbox')
    this.el.style.display = 'flex'
    if (typeof opts.gap === 'number') {
      this.el.style.gap = `${opts.gap}px ${opts.gap}px`
    } else if (opts.gap) {
      this.el.style.gap = `${opts.gap.row}px ${opts.gap.column}px`
    }
    // wrap
    if (opts.wrap) {
      this.el.style.flexWrap = 'wrap'
    } else {
      this.el.style.flexWrap = 'nowrap'
      // this.el.style.overflowX = 'auto'
    }
    if (opts.reverse) {
      this.el.style.flexDirection = 'row-reverse'
    } else {
      this.el.style.flexDirection = 'row'
    }
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
    // children
    this.addChild(...buildSubModules(opts.children))
    if (opts.onClick) {
      this.el.style.cursor = 'pointer'
      this.el.addEventListener('click', opts.onClick)
    }
  }
}
