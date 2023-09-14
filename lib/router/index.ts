import { HashRouter } from './hash-router'
import { HistoryRouter } from './history-router'
import { Router, RouterRule } from './router'

let router: Router | undefined

/**
 * 初始化路由
 */
export function initRouter(opts: {
  /**
   * 模式
   */
  mode: 'hash' | 'history'
  /**
   * 基础路径，history 模式有效
   */
  base?: string
  /**
   * 路由规则
   */
  rules: RouterRule[]
  /**
   * 最大缓存路由页面的数量
   */
  cacheLimit?: number
}) {
  if (router) {
    return router
  }
  if (opts.mode === 'hash') {
    router = new HashRouter(opts.rules, opts.cacheLimit)
  } else {
    router = new HistoryRouter({ rules: opts.rules, cacheLimit: opts.cacheLimit, base: opts.base })
  }
  return router
}
/**
 * 获取路由
 */
export function getRouter(): Router {
  if (!router) {
    throw new Error('路由尚未初始化')
  }
  return router
}

export * from './router'
export * from './router-link'
