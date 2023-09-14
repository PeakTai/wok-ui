import { DivModule } from '../module'

/**
 * 远程svg图标，推荐在项目中使用，使用远程的 svg 图片而不集成在项目中，
 * 减少包体积，提升打包速度和程序加载速度
 */
export class RemoteSvgIcon extends DivModule {
  constructor(iconUrl: string) {
    super('wok-ui-svg-icon')
    const svg = this.el.querySelector('svg')
    if (svg) {
      svg.setAttribute('fill', 'currentColor')
    }
    fetch(iconUrl)
      .then(async res => {
        if (res.status !== 200) {
          throw new Error(`请求图标失败，状态码：${res.status}，地址：${iconUrl}`)
        }
        this.el.innerHTML = await res.text()
        const svg = this.el.querySelector('svg')
        if (svg) {
          svg.setAttribute('fill', 'currentColor')
        }
      })
      .catch(console.error)
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
