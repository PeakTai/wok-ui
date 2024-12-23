import { showWarning } from '../message'
import { Module } from '../module'
import { CachedModule } from './cache'
import { PathPart, isPathRuleEquals, matchPath, parsePathRule } from './path'
import { Query } from './query-string'

/**
 * 路由模块.
 * 注：取消了对构造器的支持，因为构造器在运行时很难与函数区分开，程序的处理过于复杂，也不理想.
 */
export type RouterModule = (() => Module) | (() => Promise<Module>)

/**
 * 目标路由位置
 */
export type RouteDestination = string | { path: string; query: Query }
/**
 * 路由规则.
 */
export interface RouterRule {
  /**
   * 路径.支持路径变量，如 /users/:userId .不支持通配符做较复杂的路径.支持特殊值 * , * 表示作为默认页面.
   */
  path: string
  /**
   * 别名，用于兼容旧地址，如果路径变了，那么将旧地址写在 alias 中.如果 path 定义了变量，那么别名中的变量必须对应.
   */
  alias?: string[]
  /**
   * 模块.
   */
  module: RouterModule
  /**
   * 是否缓存，被缓存的页面模块会被包裹在一层 div 中，页面切换时不会真正销毁，而是将包裹层隐藏
   */
  cache?: boolean
}
/**
 * 页面路由信息
 */
export interface Route {
  path: string
  query?: Query
}
/**
 * 路由抽象基类初始化参数
 */
export interface AbstractRouterInitOpts {
  /**
   * 规则，不允许重复
   */
  rules: RouterRule[]
  /**
   * 缓存页面的数量限制
   */
  cacheLimit?: number
  /**
   * 钩子，部分函数能够影响流程，在路由导航处理失败的情况下，页面地址也不会回退
   */
  hooks?: {
    /**
     * 在路由导航之前执行，来决定是否要进行导航
     * @param to 要导航的目标路由信息
     * @param from 来源路由信息，表示用户是从哪个路由导航来的
     * @returns 布尔值来表示是否继续进行路由导航
     * @throws 发生异常的情况下，路由导航也会被中止
     */
    beforeEach?: (to: Route, from: Route) => Promise<boolean> | boolean
    /**
     * 在路由导航处理完成后执行，不管处理成功与否，即便在 beforeEach 钩子中返回 false 也会执行 afterEach，
     * 总之每次导航必定会触发一次 afterEach
     * @param to 要导航的目标路由信息
     * @param from 来源路由信息，表示用户是从哪个路由导航来的
     * @param  isSuccess 此次导航是否成功
     * @returns 返回结果不会影响流程
     */
    afterEach?: (to: Route, from: Route, isSuccess: boolean) => void
    /**
     * 错误处理，可以在发生错误的情况下做一些额外的处理，比如重新导航到某个特定页面。
     * 如果没有指定 errorHandler 则会由路由组件来处理，默认会弹出提示。
     * @param error 错误信息
     * @param to 要导航的目标路由信息
     * @param from 来源路由信息，表示用户是从哪个路由导航来的
     * @returns
     */
    errorHandler?: (error: any, to: Route, from: Route) => void
  }
}
/**
 * 路径信息
 */
interface PathInfo {
  pathRule: string
  parts: PathPart[]
  module: RouterModule
  cache: boolean
}

/**
 * 路由，用于模拟页面跳转，而不刷新页面.路由本身也是一个模块，切换页面实际上就是动态的切换路由中的子模块.
 */
export abstract class Router extends Module {
  /**
   * 路径规则列表，用于匹配.
   */
  private readonly paths: PathInfo[] = []

  private defaultPathInfo?: PathInfo
  /**
   * 当前路径.
   */
  private currentPath: string = ''
  /**
   * 路径变量.
   */
  private pathVars: Record<string, string> = {}
  /**
   * 查询参数.
   */
  private query: Query = {}
  /**
   * 当前展示的模块
   */
  private currentModule?: Module
  /**
   * 缓存限制
   */
  private cacheLimit = 10
  /**
   * 容器滚动监听器
   */
  private scrollListener: () => void
  /**
   * 忽略滚动标记，如果为 true 则不要记录位置信息，在浏览器后退的情况下会有一次将滚动位置重置，
   * 必须要避免这次，否则影响缓存页面的位置恢复
   */
  protected ignoreScroll = false

  constructor(private routerOpts: AbstractRouterInitOpts) {
    super(document.createElement('div'))
    if (routerOpts.cacheLimit && routerOpts.cacheLimit >= 1) {
      this.cacheLimit = routerOpts.cacheLimit
    }
    routerOpts.rules
      .flatMap<PathInfo>(rule => {
        if (!rule.alias) {
          return [
            {
              pathRule: rule.path,
              module: rule.module,
              parts: parsePathRule(rule.path),
              cache: !!rule.cache
            }
          ]
        }
        const aliasPaths = rule.alias.map<PathInfo>(alias => ({
          pathRule: alias,
          module: rule.module,
          parts: parsePathRule(alias),
          cache: !!rule.cache
        }))
        return [
          {
            pathRule: rule.path,
            module: rule.module,
            parts: parsePathRule(rule.path),
            cache: !!rule.cache
          },
          ...aliasPaths
        ]
      })
      .forEach(pathInfo => {
        if (pathInfo.pathRule === '*') {
          if (this.defaultPathInfo) {
            throw new Error('默认路径重复，配置了多个路径为 * 的路由')
          }
          this.defaultPathInfo = pathInfo
          return
        }
        const existPath = this.paths.find(p => isPathRuleEquals(p.parts, pathInfo.parts))
        if (existPath) {
          throw new Error(`路径规则重复：${pathInfo.pathRule} ，${existPath.pathRule}`)
        }
        this.paths.push(pathInfo)
      })
    // 缓存位置
    this.scrollListener = () => {
      setTimeout(() => {
        if (this.ignoreScroll) {
          this.ignoreScroll = false
          return
        }
        if (this.currentModule && this.currentModule instanceof CachedModule) {
          this.currentModule.cacheScroll()
        }
      }, 0)
    }
    window.addEventListener('scroll', this.scrollListener)
  }
  /**
   * 卸载当前模块，准备切换到下个页面的模块
   */
  private unloadCurrentModule() {
    if (this.currentModule) {
      if (this.currentModule instanceof CachedModule) {
        this.currentModule.hide()
      } else {
        this.currentModule.destroy()
      }
    }
  }

  handleUrl() {
    this.asyncHandleUrl().catch(showWarning)
  }

  private async asyncHandleUrl() {
    const fromRoute = this.getRouterInfo()
    const toRoute = this.parseCurrentUrl()
    let isSuccess = true
    try {
      // 前置钩子
      if (this.routerOpts.hooks && this.routerOpts.hooks.beforeEach) {
        const res = await this.routerOpts.hooks.beforeEach(toRoute, fromRoute)
        if (!res) {
          isSuccess = false
          return
        }
      }
      this.currentPath = toRoute.path
      this.query = toRoute.query || {}
      // 匹配路径
      const targetPath = this.paths.find(p => {
        const res = matchPath(this.currentPath, p.parts)
        if (res.matched) {
          this.pathVars = res.vars || {}
          return true
        } else {
          return false
        }
      })
      // 重置页面滚动位置，一般切换地址，位置都会重置
      // 但是实测部分移动端浏览器不会，反而将下个页面顶起，主动重置一次可以避免
      window.scrollTo({ left: 0, top: 0, behavior: 'instant' as ScrollBehavior })
      if (!targetPath) {
        if (this.defaultPathInfo) {
          const module = await this.defaultPathInfo.module()
          this.unloadCurrentModule()
          this.addChild(module)
          this.currentModule = module
        } else {
          throw 'Path not set：' + this.currentPath
        }
      } else if (targetPath.cache) {
        const key = JSON.stringify(toRoute)
        // 先尝试缓存
        const cachedModule = this.getChildren()
          .filter(c => c instanceof CachedModule)
          .map(c => c as CachedModule)
          .find(c => c.key === key)
        if (cachedModule) {
          this.unloadCurrentModule()
          cachedModule.show()
          this.currentModule = cachedModule
          return
        }
        // 未找到缓存，重新构建并缓存
        const module = await targetPath.module()
        const newCachedModule = new CachedModule(key, module)
        this.unloadCurrentModule()
        this.addChild(newCachedModule)
        this.currentModule = newCachedModule
        // 缓存满则清理掉最前面的模块
        const cachedModules = this.getChildren()
          .filter(c => c instanceof CachedModule)
          .map(c => c as CachedModule)
        if (cachedModules.length > this.cacheLimit) {
          this.removeChild(cachedModules[0])
        }
      } else {
        const module = await targetPath.module()
        this.unloadCurrentModule()
        this.addChild(module)
        this.currentModule = module
      }
    } catch (e) {
      isSuccess = false
      if (this.routerOpts.hooks && this.routerOpts.hooks.errorHandler) {
        this.routerOpts.hooks.errorHandler(e, toRoute, fromRoute)
        return
      }
      throw e
    } finally {
      // 后置钩子
      if (this.routerOpts.hooks && this.routerOpts.hooks.afterEach) {
        this.routerOpts.hooks.afterEach(toRoute, fromRoute, isSuccess)
      }
    }
  }

  /**
   * 解析当前的地址.
   */
  protected abstract parseCurrentUrl(): Route
  /**
   * 获取当前路由信息
   * @returns
   */
  getRouterInfo(): Route {
    return {
      path: this.currentPath,
      query: this.query
    }
  }
  /**
   * 清除当前页面的缓存
   */
  removeCurrentPageCache() {
    if (!this.currentModule) {
      return
    }
    if (this.currentModule instanceof CachedModule) {
      this.currentModule.cancel()
    }
  }
  /**
   * 删除某个路径下的缓存
   * @param path 路径
   */
  removeCacheByPath(path: string) {
    this.getChildren()
      .filter(c => c instanceof CachedModule)
      .map(c => c as CachedModule)
      .filter(c => {
        const route = JSON.parse(c.key) as Route
        return route.path === path
      })
      .forEach(c => {
        if (c === this.currentModule) {
          c.cancel()
        } else {
          c.destroy()
        }
      })
  }
  /**
   * 清除匹配指定规则的页面的缓存
   * @param filter 过滤器，匹配要被清理的页面
   */
  removeCache(filter: (route: Route) => boolean) {
    this.getChildren()
      .filter(c => c instanceof CachedModule)
      .map(c => c as CachedModule)
      .filter(c => {
        const route = JSON.parse(c.key) as Route
        return filter(route)
      })
      .forEach(c => {
        if (c === this.currentModule) {
          c.cancel()
        } else {
          c.destroy()
        }
      })
  }

  abstract buildUrl(location: RouteDestination): string
  abstract push(location: RouteDestination): void
  abstract replace(location: RouteDestination): void
  /**
   * 按名称获取链接上的参数，返回第一个值，如“url?a=1&a=2”，getParam('a') 返回 '1'
   * @param paramName 参数名称
   * @returns
   */
  getParam(paramName: string): string {
    const val = this.query[paramName]
    if (!val) {
      return ''
    }
    return typeof val === 'string' ? val : val[0] || ''
  }
  /**
   * 获取链接上的所有指定名称的参数值，如“url?a=1&a=2”，getParamVals('a') 返回 ['1','2']
   * @param paramName
   * @returns
   */
  getParamVals(paramName: string): string[] {
    const val = this.query[paramName]
    return typeof val === 'string' ? [val] : val
  }
  /**
   * 获取路径变量，如路由路径是“/books/:id”，则在相应的页面通过 getPathVar('id') 可以获取到 :id 表示的这一段路径内容
   * @param varName
   * @returns
   */
  getPathVar(varName: string): string {
    return this.pathVars[varName] || ''
  }
  destroy(): void {
    window.removeEventListener('scroll', this.scrollListener)
    super.destroy()
  }
}
