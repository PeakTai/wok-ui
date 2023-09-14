import { ConvertibleModule, Module } from '../module'
import './style.less'
/**
 * 链接.
 */
export class Link extends Module {
  constructor(opts: {
    /**
     * 内容.
     */
    content: ConvertibleModule
    /**
     * 地址.
     */
    url?: string
    /**
     * 点击回调.
     */
    onClick?: (ev: MouseEvent) => void
    /**
     * 目标.
     */
    target?: 'self' | 'blank' | 'parent' | 'top'
    /**
     * 下载名称.
     */
    download?: string
  }) {
    const link = document.createElement('a')
    super(link)
    link.classList.add('wok-ui-link')
    if (typeof opts.content === 'string') {
      link.innerText = opts.content
    } else if (Array.isArray(opts.content)) {
      this.addChild(...opts.content)
    } else {
      this.addChild(opts.content)
    }
    if (opts.url) {
      link.href = opts.url
    } else if (opts.onClick) {
      link.href = 'javascript:;'
    }
    if (opts.target) {
      link.target = `_${opts.target}`
    }
    if (opts.download) {
      link.download = opts.download
    }
    if (opts.onClick) {
      link.addEventListener('click', e => {
        e.preventDefault()
        if (opts.onClick) {
          opts.onClick(e)
        }
      })
    }
  }

  /**
   * 触发点击，适用于一些特殊情况.
   * 注意：浏览器有可能不兼容，最好还是让用户主动点击.
   */
  triggerClick(): Link {
    const a = this.el as HTMLAnchorElement
    a.click()
    return this
  }
}
