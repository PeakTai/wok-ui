import { Module } from '../module'
import './style.less'

/**
 * 一级标题
 */
export class H1 extends Module {
  constructor(text: string) {
    super(document.createElement('h1'))
    this.el.textContent = text
    this.el.classList.add('wok-ui-heading')
  }
}

/**
 * 二级标题
 */
export class H2 extends Module {
  constructor(text: string) {
    super(document.createElement('h2'))
    this.el.textContent = text
    this.el.classList.add('wok-ui-heading')
  }
}

/**
 * 三级标题
 */
export class H3 extends Module {
  constructor(text: string) {
    super(document.createElement('h3'))
    this.el.textContent = text
    this.el.classList.add('wok-ui-heading')
  }
}

/**
 * 四级标题
 */
export class H4 extends Module {
  constructor(text: string) {
    super(document.createElement('h4'))
    this.el.textContent = text
    this.el.classList.add('wok-ui-heading')
  }
}

/**
 * 五级标题
 */
export class H5 extends Module {
  constructor(text: string) {
    super(document.createElement('h5'))
    this.el.textContent = text
    this.el.classList.add('wok-ui-heading')
  }
}

/**
 * 六级标题
 */
export class H6 extends Module {
  constructor(text: string) {
    super(document.createElement('h6'))
    this.el.textContent = text
    this.el.classList.add('wok-ui-heading')
  }
}
