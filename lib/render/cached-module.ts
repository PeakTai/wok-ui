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
    const parent = this.getParent()
    if (parent) {
      ;(parent as any).removeChild(this)
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
