import { getRouter } from '.'
import { Link } from '../link'
import { Module } from '../module'
import { Query } from './query-string'

/**
 * 路由链接，为了能更好的被搜索抓取内容，优化seo，建议需要链接跳转的地方，
 * 都使用 RouterLink，而不要调用 api （router.push）跳转
 */
export class RouterLink extends Link {
  constructor(opts: {
    /**
     * 路径
     */
    path: string
    /**
     * 查询参数
     */
    query?: Query
    /**
     * 是否以替换当前页面的形式跳转，替换后不能后退回到当前的页面
     */
    replace?: boolean
    /**
     * 链接中的内容
     */
    content: Module | string
  }) {
    const router = getRouter()
    const url = router.buildUrl(opts.query ? { path: opts.path, query: opts.query } : opts.path)
    super({
      content: opts.content,
      url,
      onClick(ev) {
        ev.stopPropagation()
        ev.stopPropagation()
        if (opts.replace) {
          if (opts.query) {
            router.replace({ path: opts.path, query: opts.query })
          } else {
            router.replace(opts.path)
          }
        } else {
          if (opts.query) {
            router.push({ path: opts.path, query: opts.query })
          } else {
            router.push(opts.path)
          }
        }
      }
    })
  }
}
