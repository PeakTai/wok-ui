import { DivModule } from '../module'

/**
 * svg 图标
 */
export class SvgIcon extends DivModule {
  constructor(svgHtml: string) {
    super('wok-ui-svg-icon')
    this.el.innerHTML = svgHtml
    const svg = this.el.querySelector('svg')
    if (svg) {
      svg.setAttribute('fill', 'currentColor')
    }
  }
  /**
   * 强制改变大小，默认是和文字一样大的
   * @param height
   * @returns
   */
  setSize(height: number) {
    this.el.style.fontSize = `${height}px`
    return this
  }
  /**
   * 改变颜色
   * @param color
   * @returns
   */
  setColor(color: string) {
    this.el.style.color = color
    return this
  }
}
