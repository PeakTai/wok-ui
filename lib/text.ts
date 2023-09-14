import { getColor } from './color'
import { Module } from './module'
/**
 * 文本选项
 */
export interface TextOpts {
  /**
   * 指定标签，默认是 span 标签
   */
  tag?: keyof HTMLElementTagNameMap
  /**
   * 文字
   */
  text: string
  /**
   * 颜色
   */
  color?: string
  /**
   * 尺寸，支持预设和自定义数字（单位px）
   */
  size?: 'sm' | 'default' | 'large' | 'xl' | number
  /**
   * 是否加粗
   */
  bold?: boolean
  /**
   * 点击事件
   * @param ev
   * @returns
   */
  onClick?: (ev: MouseEvent) => void
}

/**
 * 文本.
 */
export class Text extends Module {
  constructor(opts: string | TextOpts) {
    const finalOpts: TextOpts = typeof opts === 'string' ? { text: opts } : opts
    const tag = finalOpts.tag || 'span'
    super(document.createElement(tag))
    this.el.className = 'wok-ui-text'
    this.el.innerText = finalOpts.text
    if (finalOpts.size) {
      this.setSize(finalOpts.size)
    }
    if (finalOpts.bold) {
      this.el.style.fontWeight = 'bold'
    }
    if (finalOpts.color) {
      this.el.style.color = finalOpts.color
    }
    if (finalOpts.onClick) {
      this.onClick(finalOpts.onClick)
    }
  }

  setText(text: string) {
    this.el.innerText = text
    return this
  }

  setColor(color: string) {
    this.el.style.color = color
    return this
  }

  setSize(size: TextOpts['size']) {
    if (size === 'sm') {
      this.el.style.fontSize = '0.8rem'
    } else if (size === 'default') {
      this.el.style.fontSize = '1rem'
    } else if (size === 'large') {
      this.el.style.fontSize = '1.2rem'
    } else if (size === 'xl') {
      this.el.style.fontSize = '1.4rem'
    } else {
      this.el.style.fontSize = `${size}px`
    }
    return this
  }

  setBold(bold: boolean) {
    if (bold) {
      this.el.style.fontWeight = 'bold'
    } else {
      this.el.style.fontWeight = 'normal'
    }
    return this
  }

  onClick(listener: (ev: MouseEvent) => void) {
    this.el.style.cursor = 'pointer'
    this.el.addEventListener('click', listener)
    return this
  }
}

// ----- 预设文本

/**
 * 首要正文
 */
export class PrimaryBodyText extends Text {
  constructor(text: string) {
    super({
      text,
      size: 'default',
      color: getColor().text
    })
  }
}
/**
 * 次要正文
 */
export class SecondaryBodyText extends Text {
  constructor(text: string) {
    super({
      text,
      size: 'default',
      color: getColor().textSecondary
    })
  }
}

/**
 * 小号次要正文
 */
export class SmallSecondaryBodyText extends Text {
  constructor(text: string) {
    super({
      text,
      size: 'sm',
      color: getColor().textSecondary
    })
  }
}

/**
 * 普通标题，对应 h2 标签
 */
export class Title extends Text {
  constructor(text: string) {
    super({
      tag: 'h2',
      text,
      size: 'large',
      color: getColor().text,
      bold: true
    })
    this.el.style.margin = '0'
  }
}
/**
 * 大号标题，对应 h1 标签，建议一个页面最多出现一个，作为页面的标题
 */
export class LargeTitle extends Text {
  constructor(text: string) {
    super({
      tag: 'h1',
      text,
      size: 'xl',
      color: getColor().text,
      bold: true
    })
    this.el.style.margin = '0'
  }
}
