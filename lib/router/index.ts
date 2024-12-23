import { HashRouter } from './hash-router'
import { HistoryRouter } from './history-router'
import { AbstractRouterInitOpts, Router } from './router'

let router: Router | undefined

/**
 * 路由初始化参数
 */
export type RouiterInitOpts = AbstractRouterInitOpts & {
  /**
   * 模式
   */
  mode: 'hash' | 'history'
  /**
   * 基础路径，history 模式有效
   */
  base?: string
}

/**
 * 初始化路由
 */
export function initRouter(opts: RouiterInitOpts) {
  if (router) {
    throw new Error(
      'The router has already been initialized. ' +
        'Initialization can only occur once to prevent inconsistencies and ' +
        'ensure proper functioning of the application.'
    )
  }
  if (opts.mode === 'hash') {
    router = new HashRouter(opts)
  } else {
    router = new HistoryRouter(opts)
  }
  return router
}
/**
 * 获取路由
 */
export function getRouter(): Router {
  if (!router) {
    throw new Error('The route has not been initialized !')
  }
  return router
}

export * from './router'
export * from './router-link'
