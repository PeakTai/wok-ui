import { DivModule, Module, createDomModule } from '../module'
import { PrimaryBodyText } from '../text'
import './loading.less'

class Loading extends DivModule {
  constructor(msg?: string) {
    super('wok-ui-loading')
    // loading 图标
    this.addChild({
      classNames: ['loading-spinner'],
      // <!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2023 Fonticons, Inc. -->
      innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg>`
    })
    // 提示文字
    if (msg) {
      this.addChild(new PrimaryBodyText(msg))
    }
  }
}

let loading: Loading | undefined

/**
 * 显示全屏 loading
 *
 */
export function showLoading(msg?: string) {
  hideLoading()
  loading = new Loading(msg)
  loading.mount(document.body)
}
/**
 * 关闭全屏 loading
 */
export function hideLoading() {
  if (loading) {
    loading.destroy()
    loading = undefined
  }
}
