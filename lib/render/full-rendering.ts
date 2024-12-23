import { Cache } from './cache'
import { Module } from '../module'

/**
 * 全量渲染模块，当内部有变化时，需要整个模块的内容重新渲染.
 * 子类需要实现 buildContent()方法，用于构建完整内容.在需要渲染的时候调用
 * render() 方法，render() 方法可以保证在同步逻辑完成后异步进行渲染，尽可能少的
 * 重新构建内容. 全量渲染不是必须的，在 buildContent()
 * 中也可以自定义局部更改部分内容，在需要全量渲染时调用 render() .
 *
 * 一般情况下全量渲染不会导致滚动位置变化引发页面抖动，但是如果内容里有图片就会
 * 出现滚动位置变化和闪烁的情况，因为图片加载前和加载成功后会有大小变化。
 * 目前可以通过 cacheModule 来缓存图片组件避免重新渲染来解决。
 */
export abstract class FullRenderingModule extends Module {
  constructor(rootEl?: HTMLElement) {
    super(rootEl || document.createElement('div'))
  }

  private __pendingRender = false
  /**
   * 缓存
   */
  private __cache = new Cache()

  /**
   * 渲染。会尽可能减少负载的情况下重新构建内容。
   * 注意：渲染是异步的，不会立即执行，由于渲染操作有可能被合并执行，也没有回调。
   * 如果有需要等等渲染结果的逻辑，可以将设置参数 immediate 为 true，这样渲染就是同步的。
   *
   * @param immediate 是否立即渲染
   */
  protected render(immediate = false) {
    if (immediate) {
      this.empty()
      this.buildContent()
      return
    }
    this.__pendingRender = true
    setTimeout(() => {
      if (!this.__pendingRender) {
        return
      }
      this.__pendingRender = false
      try {
        this.empty()
        this.buildContent()
      } catch (e) {
        console.error(e)
      }
    }, 0)
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
