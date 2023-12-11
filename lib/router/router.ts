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
  #scrollTop = 0
  #title = ''

  constructor(readonly key: string, module: Module) {
    super()
    this.addChild(module)
  }

  cacheScrollTop() {
    this.#scrollTop = window.scrollY
  }

  hide() {
    this.el.style.display = 'none'
    this.#title = document.title
  }

  show() {
    this.el.style.display = 'block'
    if (this.#title) {
      document.title = this.#title
    }
    if (this.#scrollTop) {
      setTimeout(() => {
        window.scrollTo({ top: this.#scrollTop, behavior: 'instant' as ScrollBehavior })
      }, 0)
    }
  }
}

/**
 * 路由，用于模拟页面跳转，而不刷新页面.路由本身也是一个模块，切换页面实际上就是动态的切换路由中的子模块.
 */
export abstract class Router extends Module {
  /**
   * 路径规则列表，用于匹配.
   */
  readonly #paths: PathInfo[] = []

  #defaultPathInfo?: PathInfo
  /**
   * 当前路径.
   */
  #currentPath: string = ''
  /**
   * 路径变量.
   */
  #pathVars: Record<string, string> = {}
  /**
   * 查询参数.
   */
  #query: Query = {}
  /**
   * 当前展示的模块
   */
  #currentModule?: Module
  /**
   * 缓存限制
   */
  #cacheLimit = 10
  /**
   * 容器滚动监听器
   */
  #scrollListener: () => void

  constructor(options: { rules: RouterRule[]; cacheLimit?: number }) {
    super(document.createElement('div'))
    if (options.cacheLimit && options.cacheLimit >= 1) {
      this.#cacheLimit = options.cacheLimit
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
          if (this.#defaultPathInfo) {
            throw new Error('默认路径重复，配置了多个路径为 * 的路由')
          }
          this.#defaultPathInfo = pathInfo
          return
        }
        const existPath = this.#paths.find(p => isPathRuleEquals(p.parts, pathInfo.parts))
        if (existPath) {
          throw new Error(`路径规则重复：${pathInfo.pathRule} ，${existPath.pathRule}`)
        }
        this.#paths.push(pathInfo)
      })
    // 缓存位置
    this.#scrollListener = () => {
      if (this.#currentModule && this.#currentModule instanceof CachedModule) {
        this.#currentModule.cacheScrollTop()
      }
    }
    window.addEventListener('scroll', this.#scrollListener)
  }

  handleUrl() {
    const parRes = this.parseCurrentUrl()
    this.#currentPath = parRes.path
    this.#query = parRes.query || {}
    // 匹配路径
    const targetPath = this.#paths.find(p => {
      const res = matchPath(this.#currentPath, p.parts)
      if (res.matched) {
        this.#pathVars = res.vars || {}
        return true
      } else {
        return false
      }
    })
    // 清理或隐藏掉现在的模块
    if (this.#currentModule) {
      if (this.#currentModule instanceof CachedModule) {
        this.#currentModule.hide()
      } else {
        this.#currentModule.destroy()
      }
    }
    if (!targetPath) {
      if (this.#defaultPathInfo) {
        this.#handleModule(this.#defaultPathInfo.module)
          .then(m => {
            this.addChild(m)
            this.#currentModule = m
          })
          .catch(showWarning)
      } else {
        showWarning('路径未设置：' + this.#currentPath)
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
        this.#currentModule = cachedModule
        return
      }
      // 未找到缓存，重新构建并缓存
      this.#handleModule(targetPath.module)
        .then(m => {
          const newCachedModule = new CachedModule(key, m)
          this.addChild(newCachedModule)
          this.#currentModule = newCachedModule
          // 缓存满则清理掉最前面的模块
          const cachedModules = this.getChildren()
            .filter(c => c instanceof CachedModule)
            .map(c => c as CachedModule)
          if (cachedModules.length > this.#cacheLimit) {
            this.removeChild(cachedModules[0])
          }
        })
        .catch(showWarning)
    } else {
      this.#handleModule(targetPath.module)
        .then(m => {
          this.addChild(m)
          this.#currentModule = m
        })
        .catch(showWarning)
    }
  }

  async #handleModule(module: RouterModule): Promise<Module> {
    return module()
  }

  /**
   * 解析当前的地址.
   */
  protected abstract parseCurrentUrl(): { path: string; query?: Query }
  /**
   * 获取当前路由信息
   * @returns
   */
  getRouterInfo() {
    return {
      path: this.#currentPath,
      query: this.#query
    }
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
    const val = this.#query[paramName]
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
    const val = this.#query[paramName]
    return typeof val === 'string' ? [val] : val
  }
  /**
   * 获取路径变量，如路由路径是“/books/:id”，则在相应的页面通过 getPathVar('id') 可以获取到 :id 表示的这一段路径内容
   * @param varName
   * @returns
   */
  getPathVar(varName: string): string {
    return this.#pathVars[varName] || ''
  }

  destroy(): void {
    window.removeEventListener('scroll', this.#scrollListener)
    super.destroy()
  }
}
