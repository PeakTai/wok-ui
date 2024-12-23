import { buildQueryString, parseQueryString, Query } from './query-string'
import { AbstractRouterInitOpts, RouteDestination, Router } from './router'

/**
 * h5 历史记录路由.
 */
export class HistoryRouter extends Router {
  readonly listener: () => void
  readonly base?: string
  constructor(opts: AbstractRouterInitOpts & { base?: string }) {
    super(opts)
    this.base = opts.base
    // 判定
    const { pathname } = location
    if (this.base && !pathname.startsWith(this.base)) {
      throw new Error('无法创建路由，当前路径不在设定的 base 下')
    }
    this.listener = () => {
      this.ignoreScroll = true
      this.handleUrl()
    }
    window.addEventListener('popstate', this.listener)
    // 异步执行第一次链接处理，为的是在构造完成后执行
    // 否则未造成成功就执行，配置的路由组件如果对路由实例有依赖就会出错
    setTimeout(() => this.handleUrl(), 0)
  }

  parseCurrentUrl(): { path: string; query?: Query | undefined } {
    const { href, origin } = location
    let path = href.substring(origin.length)
    // 忽略 hash
    const poundIdx = path.indexOf('#')
    if (poundIdx !== -1) {
      path = path.substring(0, poundIdx)
    }
    let query: Query | undefined
    const qmarkIdx = path.indexOf('?')
    if (qmarkIdx !== -1) {
      const qs = path.substring(qmarkIdx + 1)
      path = path.substring(0, qmarkIdx)
      query = parseQueryString(qs)
    }
    return { path, query }
  }

  buildUrl(path: RouteDestination): string {
    if (typeof path === 'string') {
      return this.buildUrl({ path, query: {} })
    }
    let finalPath = path.path
    if (!finalPath.startsWith('/')) {
      finalPath = `/${finalPath}`
    }
    if (this.base) {
      finalPath = `${this.base}${finalPath}`
    }
    if (!finalPath.startsWith('/')) {
      finalPath = `/${finalPath}`
    }
    if (path.query) {
      finalPath = `${finalPath}?${buildQueryString(path.query)}`
    }
    return `${location.origin}${finalPath}`
  }

  push(path: RouteDestination) {
    history.pushState({}, '', this.buildUrl(path))
  }

  replace(path: RouteDestination) {
    history.replaceState({}, '', this.buildUrl(path))
  }

  destroy(): void {
    window.removeEventListener('popstate', this.listener)
    super.destroy()
  }
}
