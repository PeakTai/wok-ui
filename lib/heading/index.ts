import { ColorKey, resolveColor } from '../color'
import { Module, SubModulesOpt, buildSubModules } from '../module'
import './style.less'

type HeadingTextOpts =
  | string
  | {
      content: SubModulesOpt
      color?: ColorKey
    }

abstract class Heading extends Module {
  constructor(tag: keyof HTMLElementTagNameMap, text: HeadingTextOpts) {
    super(document.createElement(tag))
    this.el.classList.add('wok-ui-heading')
    if (typeof text === 'string') {
      this.el.textContent = text
    } else {
      this.addChild(...buildSubModules(text.content))
      if (text.color) {
        this.el.style.color = resolveColor(text.color)
      }
    }
  }
}
/**
 * 一级标题
 */
export class H1 extends Heading {
  constructor(text: HeadingTextOpts) {
    super('h1', text)
  }
}

/**
 * 二级标题
 */
export class H2 extends Heading {
  constructor(text: HeadingTextOpts) {
    super('h2', text)
  }
}

/**
 * 三级标题
 */
export class H3 extends Heading {
  constructor(text: HeadingTextOpts) {
    super('h3', text)
  }
}

/**
 * 四级标题
 */
export class H4 extends Heading {
  constructor(text: HeadingTextOpts) {
    super('h4', text)
  }
}

/**
 * 五级标题
 */
export class H5 extends Heading {
  constructor(text: HeadingTextOpts) {
    super('h5', text)
  }
}

/**
 * 六级标题
 */
export class H6 extends Heading {
  constructor(text: HeadingTextOpts) {
    super('h6', text)
  }
}
