import { DivModule, Module } from '../module'

export class CachedModule extends DivModule {
  constructor(module: Module) {
    super()
    this.addChild(module)
  }
  /**
   * 销毁，仅仅解除父子关系，不清除内容
   * @returns
   */
  destroy(): void {
    const parent = this.getParent() as any
    if (parent) {
      // 解除关系
      const index = parent.children.indexOf(this)
      if (index !== -1) {
        parent.children.splice(index, 1)
      }
      ;(this as any).parent = undefined
    }
    this.el.remove()
  }
  /**
   * 彻底销毁，就是原始的销毁
   */
  destroyThoroughly() {
    super.destroy()
  }
}
