/**
 * 模块基类. 一个模块是对一到多个 dom 元素的封装，其作用是快速复用常用的 dom 组合。
 */
export abstract class Module {
  #children: Module[] = []
  #parent?: Module
  /**
   * 销毁标识
   */
  #destroyed = false
  /**
   * 构建模块.
   * @param el 根元素.
   */
  constructor(protected readonly el: HTMLElement) {}

  protected replaceChild(index: number, newChild: Module): boolean {
    if (newChild.getParent()) {
      throw new Error('The module you want to insert already has a parent module')
    }
    const existingChild = this.#children[index]
    if (!existingChild) {
      return false
    }
    this.insertChild(index, newChild)
    this.removeChild(existingChild)
    return true
  }

  protected insertChild(index: number, newChild: ConvertibleModule): boolean {
    const newChildModule = convertToModule(newChild)
    if (newChildModule.#destroyed) {
      console.error('The module to be inserted has been destroyed', newChildModule)
      throw new Error('The module to be inserted has been destroyed')
    }
    if (newChildModule.getParent()) {
      throw new Error('The module you want to insert already has a parent module')
    }
    if (index === this.#children.length) {
      this.addChild(newChildModule)
      newChildModule.#parent = this
      return true
    }
    const existingChild = this.#children[index]
    if (!existingChild) {
      return false
    }
    this.el.insertBefore(newChildModule.el, existingChild.el)
    this.#children.splice(index, 0, newChildModule)
    newChildModule.#parent = this
    return true
  }

  /**
   * 移动子模块的位置
   * @param sourceIndex 要移动的子模块下标
   * @param targetIndex 移动后的子模块下标
   */
  protected moveChild(sourceIndex: number, targetIndex: number): boolean {
    const sourceChild = this.getChild(sourceIndex)
    const targetChild = this.getChild(targetIndex)
    if (!sourceChild || !targetChild) {
      return false
    }
    this.#children.splice(sourceIndex, 1)
    this.#children.splice(targetIndex, 0, sourceChild)
    if (sourceIndex > targetIndex) {
      this.el.insertBefore(sourceChild.el, targetChild.el)
    } else {
      const nextChild = this.getChild(targetIndex + 1)
      if (nextChild) {
        this.el.insertBefore(sourceChild.el, nextChild.el)
      } else {
        this.el.removeChild(sourceChild.el)
        this.el.appendChild(sourceChild.el)
      }
    }
    return true
  }

  destroy(): void {
    if (this.#parent) {
      // 解除关系
      const index = this.#parent.#children.indexOf(this)
      if (index !== -1) {
        this.#parent.#children.splice(index, 1)
      }
      this.#parent = undefined
    }
    this.empty()
    this.el.remove()
    this.#destroyed = true
  }

  protected empty(): void {
    ;[...this.#children].forEach(c => c.destroy())
  }

  getParent(): Module | undefined {
    return this.#parent
  }
  /**
   * 用于别的模块替换当前模块.
   * @param module
   */
  replaceBy(module: Module): boolean {
    if (!this.#parent) {
      return false
    }
    const idx = this.getIndex()
    this.#parent.replaceChild(idx, module)
    return true
  }

  protected find<T>(predicate: (m: Module) => boolean): T[] {
    const result: T[] = []
    for (const child of this.#children) {
      if (predicate(child)) {
        result.push(child as T)
      }
      result.push(...child.find<T>(predicate))
    }
    return result
  }

  protected findFirst<T>(predicate: (m: Module) => boolean): T | undefined {
    for (const child of this.#children) {
      if (predicate(child)) {
        return child as T
      }
      const grand = child.findFirst(predicate)
      if (grand) {
        return grand as T
      }
    }
    return undefined
  }

  protected addChild(...child: ConvertibleModule[]): void {
    // 外部调用 addChid(...[]) 会导致得到的 child 是 [undefined]，需要处理下，否则会有错误
    // 虽然外部检查后再调用可以避免，但是太过于繁琐了，这里处理更方便
    child.filter(c => c !== undefined).forEach(c => this.#addSingleChild(c))
  }

  #addSingleChild(child: ConvertibleModule): void {
    const childModule = convertToModule(child)
    if (childModule.#destroyed) {
      console.error('The module to be added has been destroyed', child)
      throw new Error('The module to be added has been destroyed')
    }
    if (childModule.getParent()) {
      throw new Error('The module you want to add already has a parent module')
    }
    childModule.mount(this.el)
    this.#children.push(childModule)
    childModule.#parent = this
  }

  protected removeChild(moduleOrIndex: Module | number): boolean {
    let child: Module | undefined = undefined
    let index = -1
    if (typeof moduleOrIndex === 'number') {
      index = moduleOrIndex
      child = this.#children[moduleOrIndex]
    } else {
      child = moduleOrIndex
      index = this.#children.findIndex(c => c === moduleOrIndex)
    }
    if (!child || index === -1) {
      return false
    }
    child.#parent = undefined
    child.destroy()
    this.#children.splice(index, 1)
    return true
  }

  protected getChildren(): Readonly<Module[]> {
    return this.#children
  }

  protected getChild(index: number): Module | undefined {
    return this.#children[index]
  }

  /**
   * 挂载到 dom 元素上
   * @param parentEl
   */
  mount(parentEl: Element): void {
    if (this.#parent) {
      throw new Error(
        'The current module has already been added to a parent module and cannot be mounted'
      )
    }
    if (this.#destroyed) {
      throw new Error('The current module has been destroyed !')
    }
    parentEl.appendChild(this.el)
  }

  /**
   * 滚动使元素可见.
   */
  scrollIntoView(): void {
    this.el.scrollIntoView(true)
  }

  /**
   * 获取在兄弟元素中的下标.
   * @returns
   */
  getIndex(): number {
    if (!this.#parent) {
      return -1
    }
    return this.#parent.getChildren().findIndex(c => c === this)
  }

  /**
   * 如果不可见，滚动至可见.
   */
  scrollIntoViewIfInvisible(): void {
    const el = this.el
    const rect = el.getBoundingClientRect()
    let invisible = false
    // 上
    if (rect.top + rect.height < 0) {
      invisible = true
    }
    // 下
    if (rect.top + rect.height > window.innerHeight) {
      invisible = true
    }
    // 左
    if (rect.left + rect.width < 0) {
      invisible = true
    }
    // 右
    if (rect.left > window.innerWidth) {
      invisible = true
    }
    if (!invisible) {
      return
    }
    el.scrollIntoView(true)
  }
}

/**
 * 使用 dom 元素直接转换的模块.
 */
class DomModule extends Module {
  constructor(el: HTMLElement, children?: Array<Module | HTMLElement>) {
    super(el)
    if (children) {
      children.forEach(child => this.addChild(child))
    }
  }
}

/**
 * 基础的 div 模块
 */
export class DivModule extends Module {
  constructor(...classNames: string[]) {
    const el = document.createElement('div')
    super(el)
    el.classList.add(...classNames)
  }
}

/**
 * 可转换为模块的类型，这些类型在一些场景可以直接当模块来使用，主要是为了方便.
 */
export type ConvertibleModule = string | number | Module | HTMLElement | (() => Module)

/**
 * 将受支持的类型实例转换成模块实例
 * @param cm
 */
export function convertToModule(cm: ConvertibleModule): Module {
  if (typeof cm === 'string' || typeof cm === 'number') {
    const text = document.createElement('span')
    text.innerText = `${cm}`
    return new DomModule(text)
  }
  if (cm instanceof HTMLElement) {
    return new DomModule(cm)
  }
  if (cm instanceof Module) {
    return cm
  }
  return cm()
}
/**
 * 子模块选项，可用于模块的构建参数中.
 * 支持直接使用可转换的模块和动态添加的函数.
 */
export type SubModulesOpt =
  | Exclude<ConvertibleModule, () => Module>
  | ConvertibleModule[]
  | ((addChild: (...child: ConvertibleModule[]) => void) => void)

/**
 * 子模块选项来构建子模块列表
 * @param opt
 */
export function buildSubModules(opt: SubModulesOpt): Module[] {
  if (Array.isArray(opt)) {
    return opt.map(c => convertToModule(c))
  }
  if (typeof opt === 'function') {
    const children: ConvertibleModule[] = []
    opt((...child) => children.push(...child))
    return children.map(c => convertToModule(c))
  } else {
    return [convertToModule(opt)]
  }
}

export interface CreateDomModuleOptions {
  /**
   * html标签
   */
  tag?: keyof HTMLElementTagNameMap
  /**
   * 内部文本
   */
  innerText?: string
  /**
   * 内部 html，innerText 优先级更高
   */
  innerHTML?: string
  /**
   * 属性
   */
  attrs?: Record<string, string>
  /**
   * css 类名称
   */
  classNames?: string[] | string
  /**
   * 样式设置
   */
  style?: Partial<CSSStyleDeclaration>
  /**
   * 子模块
   */
  children?: SubModulesOpt
  /**
   * 前置处理，可以在元素刚创建时做一些额外的操作
   * @param el
   * @returns
   */
  preHandle?: (el: HTMLElement) => void
  /**
   * 后置处理，可以在元素处理完成后（属性赋值和子模块构造完成）做一些额外的操作
   * @param el
   * @returns
   */
  postHandle?: (el: HTMLElement) => void
  /**
   * 点击事件，因为点击比较常用，所以有单独的设置项
   */
  onClick?: (ev: MouseEvent) => void
  /**
   * 事件绑定设置
   */
  events?: Record<string, (e: Event) => void>
}

/**
 * 快速创建一个基于 dom 元素的模块，用于构建模块内部结构
 * @param options
 * @returns
 */
export function createDomModule(options: CreateDomModuleOptions): Module {
  const el = document.createElement(options.tag || 'div') as HTMLElement
  // 前置处理
  if (options.preHandle) {
    options.preHandle(el)
  }
  if (options.innerText) {
    el.innerText = options.innerText
  } else if (options.innerHTML) {
    el.innerHTML = options.innerHTML
  }
  if (options.attrs) {
    const { attrs } = options
    Object.keys(options.attrs).forEach(key => {
      const val = attrs[key]
      if (typeof val !== 'undefined') {
        el.setAttribute(key, val)
      }
    })
  }
  if (options.classNames) {
    if (typeof options.classNames === 'string') {
      el.classList.add(options.classNames)
    } else {
      el.classList.add(...options.classNames.filter(name => !!name))
    }
  }
  if (options.style) {
    for (let property in options.style) {
      const val = options.style[property]
      if (!val) {
        continue
      }
      el.style[property] = val
    }
  }
  if (options.onClick) {
    el.addEventListener('click', options.onClick)
  }
  if (options.events) {
    for (let evtName in options.events) {
      el.addEventListener(evtName, options.events[evtName])
    }
  }
  const children: Module[] = options.children ? buildSubModules(options.children) : []
  const module = new DomModule(el, children)
  if (options.postHandle) {
    options.postHandle(el)
  }
  return module
}
