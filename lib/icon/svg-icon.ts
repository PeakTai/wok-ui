import { DivModule } from '../module'

/**
 * svg 图标
 */
export class SvgIcon extends DivModule {
  /**
   * svg 图标
   * @param options svg 图标 html 字符串 或者 配置对象
   * @param options.svgHtml svg 图标 html 字符串
   * @param options.onClick 点击事件
   * @param options.size 图标大小
   * @param options.color 图标颜色
   */
  constructor(
    options:
      | string
      | { svgHtml: string; onClick?: (e: MouseEvent) => void; size?: number; color?: string }
  ) {
    super('wok-ui-svg-icon')
    let svgHtml = ''
    if (typeof options === 'string') {
      svgHtml = options
    } else {
      svgHtml = options.svgHtml
    }
    this.el.innerHTML = svgHtml
    const svg = this.el.querySelector('svg')
    if (svg) {
      svg.setAttribute('fill', 'currentColor')
    }
    if (typeof options !== 'string') {
      if (options.size) {
        this.setSize(options.size)
      }
      if (options.color) {
        this.setColor(options.color)
      }
      if (options.onClick) {
        this.onClick(options.onClick)
      }
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

  // 点击事件绑定
  onClick(callback: (e: MouseEvent) => void) {
    this.el.style.cursor = 'pointer'
    this.el.onclick = callback
    return this
  }
}
