import { Cache } from './cache'
import { Module, addClassNames } from '../module'

interface ScrollSnapshot {
  el: Element
  left: number
  top: number
}

/**
 * 全量渲染模块，当内部有变化时，需要整个模块的内容重新渲染。
 * 子类实现 buildContent() 构建完整内容，在需要渲染时调用 render()，
 * render() 会同步清空内容、重新构建并恢复滚动位置。
 *
 * 如果内容中有图片，全量渲染可能导致滚动位置变化和闪烁（图片加载前后大小变化），
 * 可通过 cacheModule 缓存图片组件避免重新渲染来解决。
 */
export abstract class FullRenderingModule extends Module {
  constructor(elOrClassName?: HTMLElement | string) {
    let el: HTMLElement = document.createElement('div')
    if (typeof elOrClassName === 'string') {
      addClassNames(el, elOrClassName)
    } else if (elOrClassName) {
      el = elOrClassName
    }
    super(el)
  }

  private __rendering = false
  /**
   * 缓存
   */
  private __cache = new Cache()

  private __saveScrollPositions(): ScrollSnapshot[] {
    const snapshots: ScrollSnapshot[] = []
    let el: Element | null = this.el
    while (el) {
      if (el.scrollLeft > 0 || el.scrollTop > 0) {
        snapshots.push({ el, left: el.scrollLeft, top: el.scrollTop })
      }
      el = el.parentElement
    }
    return snapshots
  }

  private __restoreScrollPositions(snapshots: ScrollSnapshot[]) {
    for (const snapshot of snapshots) {
      if (snapshot.el.isConnected) {
        snapshot.el.scrollLeft = snapshot.left
        snapshot.el.scrollTop = snapshot.top
      }
    }
  }

  /**
   * 渲染，同步执行，清空内容后重新构建。
   * 如果当前正在渲染中，调用会被忽略以避免重入。
   */
  protected render() {
    if (this.__rendering) {
      return
    }
    this.__rendering = true
    try {
      const snapshots = this.__saveScrollPositions()
      this.empty()
      this.buildContent()
      this.__restoreScrollPositions(snapshots)
    } finally {
      this.__rendering = false
    }
  }

  /**
   * 构建内容, 内部实现完成的内容构建逻辑。不要主动调用这个方法，
   * 在需要全量渲染时调用 render() 方法，render() 方法内容会在适当的时候调用 buildContent()，
   * 尽可能的减少渲染次数。
   */
  protected abstract buildContent(): void

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
    this.clearCaches()
    super.destroy()
  }
}
