/**
 * 尺寸.
 */
export interface Size {
  /**
   * 文字默认大小
   */
  text: number
  /**
   * 小号文字
   */
  textSm: number
  /**
   * 大号文字
   */
  textLg: number
  /**
   * 文字特大号
   */
  textXl: number
  /**
   * 圆角半径
   */
  borderRadius: number
}

// 默认文字大小
const fsStr = window.getComputedStyle(document.body).fontSize
let defaultFontSize = fsStr.endsWith('px') ? parseInt(fsStr) : 16
if (isNaN(defaultFontSize) || defaultFontSize < 14 || defaultFontSize > 20) {
  defaultFontSize = 16
}
/**
 * 默认尺寸
 */
const defaultSize: Size = {
  text: defaultFontSize,
  textSm: defaultFontSize - 2,
  textLg: defaultFontSize + 2,
  textXl: defaultFontSize + 4,
  borderRadius: Math.round(defaultFontSize * 0.375)
}

Object.freeze(defaultSize)

/**
 * 设置的颜色
 */
let specifiedSize: Size | undefined

/**
 * 获取尺寸信息
 * @returns
 */
export function getSize(): Size {
  return specifiedSize || defaultSize
}

/**
 * 设置css变量
 */
function setCssVars(size: Size) {
  const { style } = document.body
  style.setProperty('--size-text', `${size.text}px`)
  style.setProperty('--size-text-sm', `${size.textSm}px`)
  style.setProperty('--size-text-lg', `${size.textLg}px`)
  style.setProperty('--size-text-xl', `${size.textXl}px`)
  style.setProperty('--size-border-radius', `${size.borderRadius}px`)
  document.documentElement.style.fontSize = `${size.text}px`
}

setCssVars(defaultSize)
/**
 * 自定义尺寸信息
 * @param size
 */
export function setSize(size: Partial<Size>) {
  const newSize = Object.assign({}, defaultSize)
  for (let property in size) {
    const val = size[property]
    if (!val) {
      continue
    }
    newSize[property] = val
  }
  specifiedSize = Object.freeze(newSize)
  setCssVars(specifiedSize)
}

export function resetSize() {
  setSize(defaultSize)
}

/**
 * 将以 rem 单位的值转换为 px
 * @param rem
 */
export function rem(rem: number): number {
  return getSize().text * rem
}
