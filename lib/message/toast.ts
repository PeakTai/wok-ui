/**
 * 弹出式提示信息 warning success ，不需要用户交互，仅展示，层级比 loading 稍微高一些
 */

import { getColor } from '../color'
import { DivModule, Module } from '../module'
import { HSpacer } from '../spacer'
import { Text } from '../text'
import { Animation, animate } from '../animation'
import './toast.less'
import { SvgIcon } from '../icon'

/**
 * 成功提示的图标
 */
class IconSuccess extends SvgIcon {
  constructor() {
    // <!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
    super(
      `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>`
    )
    this.setColor(getColor().success)
  }
}

/**
 * 警告图标
 */
class IconWarning extends SvgIcon {
  constructor() {
    // <!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
    super(
      `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>`
    )
    this.setColor(getColor().warning)
  }
}

/**
 * 烤箱，存放烤面包（消息）
 */
class Oven extends DivModule {
  constructor() {
    super('wok-ui-oven')
  }
  addChild(...child: (Module | HTMLElement)[]): void {
    super.addChild(...child)
  }
}
/**
 * 烤面包（弹出式提示消息）
 */
class Toast extends DivModule {
  constructor(opts: { type: 'success' | 'warning'; text: string; duration: number }) {
    super('wok-ui-toast', Animation.SLIDE_TOP)
    switch (opts.type) {
      case 'success':
        this.addChild(new IconSuccess())
        break
      case 'warning':
        this.addChild(new IconWarning())
        break
    }
    this.addChild(new HSpacer(8), new Text(opts.text))
    // 启动定时器自动销毁
    setTimeout(() => {
      this.destroy()
    }, opts.duration)
  }
  destroy(): void {
    animate({ el: this.el, animation: Animation.FADE, reverse: true, duration: 300 })
      .then(() => {
        super.destroy()
      })
      .catch(console.error)
  }
}

let oven: Oven | undefined
/**
 * 显示弹出式消息
 * @param opts
 */
export function showToast(opts: {
  /**
   * 类型
   */
  type: 'success' | 'warning'
  /**
   * 消息内容
   */
  text: string
  /**
   * 持续时间
   */
  duration?: number
}) {
  let duration = 3000
  if (opts.duration && opts.duration > 0) {
    duration = opts.duration
  }
  if (!oven) {
    oven = new Oven()
    oven.mount(document.body)
  }
  oven.addChild(new Toast({ type: opts.type, text: opts.text, duration }))
}
/**
 * 显示警告消息
 */
export function showWarning(errMsg: any) {
  let message = ''
  if (typeof errMsg === 'string') {
    message = errMsg
  } else if (errMsg.message) {
    message = errMsg.message
  } else {
    message = JSON.stringify(errMsg)
  }
  showToast({ type: 'warning', text: errMsg })
}

/**
 * 显示成功消息
 */
export function showSuccess(text: string) {
  showToast({ type: 'success', text })
}
