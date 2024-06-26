import { showWarning } from '../message'
import { DivModule, Module } from '../module'
import { PathPart, isPathRuleEquals, matchPath, parsePathRule } from './path'
import { Query } from './query-string'

/**
 * 路由模块.
 * 注：取消了对构造器的支持，因为构造器在运行时很难与函数区分开，程序的处理过于复杂，也不理想.
 */
export type RouterModule = (() => Module) | (() => Promise<Module>)
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
   * 是否缓存
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

interface PathInfo {
  pathRule: string
  parts: PathPart[]
  module: RouterModule
  cache: boolean
}
/**
 * 缓存模块，不会真正的销毁，可重复使用.
 */
class CachedModule extends DivModule {
  private scrollPos?: { left: number; top: number }
  private title = ''
  private canceled?: true

  constructor(readonly key: string, module: Module) {
    super()
    this.addChild(module)
  }

  cacheScroll() {
    this.scrollPos = { left: window.scrollX, top: window.scrollY }
  }
  /**
   * 取消缓存，取消后，再当页面被隐藏时模块销毁
   */
  cancel() {
    this.canceled = true
  }

  hide() {
    if (this.canceled) {
      this.destroy()
      return
    }
    this.el.style.display = 'none'
    this.title = document.title
    this.find(() => true).forEach(m => {
      const mm = m as any
      if (mm.onPageHide) {
        mm.onPageHide()
      }
    })
  }

  show() {
    this.el.style.display = 'block'
    if (this.title) {
      document.title = this.title
    }
    if (this.scrollPos) {
      const { left, top } = this.scrollPos
      setTimeout(() => {
        window.scrollTo({ left, top, behavior: 'instant' as ScrollBehavior })
      }, 0)
    }
    this.find(() => true).forEach(m => {
      const mm = m as any
      if (mm.onPageShow) {
        mm.onPageShow()
      }
    })
  }
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

  constructor(options: { rules: RouterRule[]; cacheLimit?: number }) {
    super(document.createElement('div'))
    if (options.cacheLimit && options.cacheLimit >= 1) {
      this.cacheLimit = options.cacheLimit
    }
    options.rules
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

  handleUrl() {
    const parRes = this.parseCurrentUrl()
    this.currentPath = parRes.path
    this.query = parRes.query || {}
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

    // 清理或隐藏掉现在的模块
    if (this.currentModule) {
      if (this.currentModule instanceof CachedModule) {
        this.currentModule.hide()
      } else {
        this.currentModule.destroy()
      }
    }
    // 重置页面滚动位置，一般切换地址，位置都会重置
    // 但是实测部分移动端浏览器不会，反而将下个页面顶起，主动重置一次可以避免
    window.scrollTo({ left: 0, top: 0, behavior: 'instant' as ScrollBehavior })
    if (!targetPath) {
      if (this.defaultPathInfo) {
        this.handleModule(this.defaultPathInfo.module)
          .then(m => {
            this.addChild(m)
            this.currentModule = m
          })
          .catch(showWarning)
      } else {
        showWarning('Path not set：' + this.currentPath)
      }
    } else if (targetPath.cache) {
      const key = JSON.stringify(parRes)
      // 先尝试缓存
      const cachedModule = this.getChildren()
        .filter(c => c instanceof CachedModule)
        .map(c => c as CachedModule)
        .find(c => c.key === key)
      if (cachedModule) {
        cachedModule.show()
        this.currentModule = cachedModule
        return
      }
      // 未找到缓存，重新构建并缓存
      this.handleModule(targetPath.module)
        .then(m => {
          const newCachedModule = new CachedModule(key, m)
          this.addChild(newCachedModule)
          this.currentModule = newCachedModule
          // 缓存满则清理掉最前面的模块
          const cachedModules = this.getChildren()
            .filter(c => c instanceof CachedModule)
            .map(c => c as CachedModule)
          if (cachedModules.length > this.cacheLimit) {
            this.removeChild(cachedModules[0])
          }
        })
        .catch(showWarning)
    } else {
      this.handleModule(targetPath.module)
        .then(m => {
          this.addChild(m)
          this.currentModule = m
        })
        .catch(showWarning)
    }
  }

  private async handleModule(module: RouterModule): Promise<Module> {
    return module()
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
  removeCache(filter: (route: Route) => void) {
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

  abstract buildUrl(path: string | { path: string; query: Query }): string
  abstract push(path: string | { path: string; query: Query }): void
  abstract replace(path: string | { path: string; query: Query }): void
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
