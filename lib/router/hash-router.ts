import { buildQueryString, parseQueryString, Query } from './query-string'
import { Router, RouterRule } from './router'

/**
 * 哈希路由.
 */
export class HashRouter extends Router {
  private readonly listener: (e: Event) => void

  constructor(rules: RouterRule[], cacheLimit?: number) {
    super({ rules, cacheLimit })
    this.listener = (e: Event) => {
      e.preventDefault()
      this.ignoreScroll = true
      this.handleUrl()
    }
    window.addEventListener('hashchange', this.listener)
    // 异步执行第一次链接处理，为的是在构造完成后执行
    // 否则未造成成功就执行，配置的路由组件如果对路由实例有依赖就会出错
    setTimeout(() => this.handleUrl(), 0)
  }

  parseCurrentUrl(): { path: string; query?: Query | undefined } {
    let { hash } = location
    if (hash.startsWith('#')) {
      hash = hash.substring(1)
    }
    const qmarkIdx = hash.indexOf('?')
    let path = hash
    if (qmarkIdx !== -1) {
      path = hash.substring(0, qmarkIdx)
    }
    let query: Query = {}
    if (qmarkIdx !== -1) {
      query = parseQueryString(hash.substring(qmarkIdx + 1))
    }
    return { path, query }
  }

  buildUrl(path: string | { path: string; query: Query }): string {
    const { href } = location
    const poundIdx = href.indexOf('#')
    const urlWithoutHash = poundIdx === -1 ? href : href.substring(0, poundIdx)
    if (typeof path === 'string') {
      return `${urlWithoutHash}#${path}`
    }
    const qs = buildQueryString(path.query)
    const hash = `${path.path}?${qs}`
    return `${urlWithoutHash}#${hash}`
  }

  push(path: string | { path: string; query: Query }) {
    if (typeof path === 'string') {
      location.hash = path
      return
    }
    const qs = buildQueryString(path.query)
    location.hash = `${path.path}?${qs}`
  }

  replace(path: string | { path: string; query: Query }) {
    location.replace(this.buildUrl(path))
  }

  destroy(): void {
    window.removeEventListener('hashchange', this.listener)
    super.destroy()
  }
}
