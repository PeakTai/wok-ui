import { Module } from '../module'
/**
 * 缓存，作用是缓存模块，保留模块中的数据和元素，被缓存的模块在使用中是不会被销毁的，
 * 不会触发销毁的生命周期（destroy），只在被清理掉缓存的时候才会进行销毁。
 *
 * 将模块缓存起来不被销毁是基于代理（proxy）实现的，所以被缓存的模块会有一些限制，
 * 模块内不能使用 es6 原生的私有属性，因为原生的私有属性不能被代理。
 */
export class Cache {
  private map = new Map<string, Module>()
  /**
   * 缓存一个模块，会将模块进行处理，生成一个新的缓存模块以供使用，与原模块类型一致，只是不能按正常流程
   * 被销毁，保持内部的数据与状态，可重复使用，可通过清除缓存来销毁。
   *
   * @param key 缓存的唯一标识
   * @param module 原始模块，要被缓存的模块
   * @returns 可供使用的缓存模块
   */
  cache(opts: {
    /**
     * 模块的唯一标识，用于缓存查找
     */
    key: string
    /**
     * 构建要缓存的模块的函数，如果查询不到缓存则调用以创建模块，
     * 每次调用函数都必须返回一个新的实例
     * @returns
     */
    module: () => Module
  }): Module {
    const cached = this.map.get(opts.key)
    if (cached) {
      return cached
    }
    const module = opts.module()
    const delegate = new Proxy(module, {
      get(target, p) {
        // 重写 destroy
        if (p === 'destroy') {
          return () => {
            // 仅仅解除关系
            const parent = target.getParent()
            if (parent) {
              ;(parent as any).removeChild(delegate)
            }
            ;(target as any).el.remove()
          }
        }
        // 增加 destroyThoroughly 方法，即是原本的销毁方法，用于真正的销毁
        if (p === 'destroyThoroughly') {
          return () => {
            target.destroy()
          }
        }
        return target[p]
      }
    })
    this.map.set(opts.key, delegate)
    return delegate
  }

  /**
   * 删除指定的缓存模块
   * @param key 调用 cache 方法缓存模块时使用的 key
   */
  remove(key: string) {
    const module = this.map.get(key)
    if (module) {
      const { destroyThoroughly } = module as any
      if (typeof destroyThoroughly === 'function') {
        destroyThoroughly()
      }
      this.map.delete(key)
    }
  }
  /**
   * 清除所有缓存
   */
  clear() {
    for (const key of this.map.keys()) {
      this.remove(key)
    }
  }
}

/**
 * 全局缓存
 */
const globalCache = new Cache()

/**
 * 获取全局缓存
 * @returns
 */
export function getCache() {
  return globalCache
}
