import { Module } from '../module'

/**
 * 代理被缓存的模块
 * @param module 要缓存的模块
 */
export function proxyCachedModule<T extends Module>(module: T): T {
  const delegate = new Proxy(module, {
    get(target, p) {
      // 重写 destroy
      if (p === 'destroy') {
        return () => {
          console.log('代理 destroy')
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
  return delegate
}
