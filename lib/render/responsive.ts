import { Cache } from './cache'
import { Module } from '../module'

/**
 * 响应式尺寸,分隔点信息:
 * xs : <576px
 * sm : ≥576px
 * md : ≥768px
 * lg : ≥992px
 * xl : ≥1200px
 * xxl : ≥1400px
 */
export type ResponsiveSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

/**
 * 响应式分隔点.
 */
export enum ResponsiveBreakPoint {
  /**
   * Small
   */
  sm = 576,
  /**
   * Medium
   */
  md = 768,
  /**
   * Large
   */
  lg = 992,
  /**
   * Extra large
   */
  xl = 1200,
  /**
   * Extra extra large
   */
  xxl = 1400
}

/**
 * 响应式模块, 根据窗口的缩放来判定是否要重新渲染.
 * 当缩放达到分隔点临界值, ResposiveSize 发生变化时, 会调用 buildContent 重新进行渲染.
 */
export abstract class ResponsiveModule extends Module {
  /**
   * 页面大小调整的监听器.
   */
  private readonly __resizeListener: () => void

  private __respSize: ResponsiveSize = 'xs'

  private __pendingRender = false
  /**
   * 缓存的模块
   */
  private __cache = new Cache()
  /**
   * 构造器.
   * @param el
   */
  constructor(el?: HTMLElement) {
    super(el || document.createElement('div'))
    this.__resizeListener = () => this.render(false)
    window.addEventListener('resize', this.__resizeListener)
  }
  /**
   * 根据尺寸信息构建内容
   */
  abstract buildContent(sizeInfo: {
    /**
     * 响应式尺寸.
     */
    respSize: ResponsiveSize
    /**
     * 视图宽度.
     */
    windowWidth: number
  }): void
  /**
   * 请求立即进行渲染.渲染会异步执行，一次程序流程中有多次调用 render() 方法的，会合并成为一次，减少消耗.
   * @param force 是否强制渲染,如果为 false ,则在尺寸信息不变化的情况下不会渲染
   * @param immediate 是否立即渲染，如果设置为 true 则渲染会立同步执行，而不是异步
   */
  protected render(force = true, immediate = false): void {
    // 强制的情况下，立即进行渲染
    if (immediate) {
      this.__render(force)
      return
    }
    this.__pendingRender = true
    setTimeout(() => {
      if (!this.__pendingRender) {
        return
      }
      this.__pendingRender = false
      try {
        this.__render(force)
      } catch (e) {
        console.error(e)
      }
    }, 0)
  }

  private __render(force: boolean) {
    let size: ResponsiveSize = 'xs'
    const windowWidth = window.innerWidth
    if (windowWidth >= 1400) {
      size = 'xxl'
    } else if (windowWidth >= 1200) {
      size = 'xl'
    } else if (windowWidth >= 992) {
      size = 'lg'
    } else if (windowWidth >= 768) {
      size = 'md'
    } else if (windowWidth >= 576) {
      size = 'sm'
    } else {
      size = 'xs'
    }
    if (force || this.__respSize !== size) {
      this.__respSize = size
      this.empty()
      this.buildContent({
        respSize: size,
        windowWidth
      })
    }
  }

  /**
   * 缓存一个模块，返回的是一个特殊的模块，能够复用，避免重新渲染.
   * 被缓存的模块将会和全量渲染模块销毁的时候一起被销毁，也可以通过 removeCache 方法主要将其销毁.
   * @param opts
   */
  protected cacheModule(opts: {
    /**
     * 模块的唯一标识，用于缓存查找
     */
    key: string
    /**
     * 要缓存的模块，一个函数，仅首次执行，如果查询到缓存结果，则不执行
     * @returns
     */
    module: () => Module
  }): Module {
    return this.__cache.cache(opts)
  }

  /**
   * 删除缓存
   * @param key
   */
  protected removeCache(key: string) {
    this.__cache.remove(key)
  }
  /**
   * 清理掉所有的缓存
   */
  protected clearCaches() {
    this.__cache.clear()
  }

  destroy(): void {
    window.removeEventListener('resize', this.__resizeListener)
    this.clearCaches()
    super.destroy()
  }
}
