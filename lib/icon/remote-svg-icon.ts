import { DivModule } from '../module'

/**
 * 缓存 map
 */
const CACHE_MAP = new Map<string, string | Promise<string>>()

async function getSvgCodeFromCache(url: string) {
  const val = CACHE_MAP.get(url)
  if (val) {
    return val
  }
  const promise = fetch(url).then(async res => {
    if (res.status !== 200) {
      throw new Error(`Failed to fetch icon, status code: ${res.status}, url：${url}`)
    }
    const contentType = res.headers.get('Content-Type')
    if (!contentType || contentType.toLowerCase() !== 'image/svg+xml') {
      throw new Error(`Failed to fetch icon, incorrect type：${contentType}`)
    }
    const code = await res.text()
    CACHE_MAP.set(url, code)
    return code
  })
  CACHE_MAP.set(url, promise)
  return promise
}

/**
 * 远程svg图标，推荐在项目中使用，使用远程的 svg 图片而不集成在项目中，
 * 减少包体积，提升打包速度和程序加载速度
 */
export class RemoteSvgIcon extends DivModule {
  constructor(iconUrl: string) {
    super('wok-ui-svg-icon')
    getSvgCodeFromCache(iconUrl)
      .then(code => {
        this.el.innerHTML = code
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
