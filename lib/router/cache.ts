import { DivModule, Module } from './../module';
/**
 * 缓存模块，不会真正的销毁，可重复使用.
 */
export class CachedModule extends DivModule {
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
