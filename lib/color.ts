/**
 * 色彩
 */
export interface Color {
  /**
   * 主题色
   */
  primary: string
  /**
   * 危险色
   */
  danger: string
  /**
   * 成功色
   */
  success: string
  /**
   * 警告色
   */
  warning: string
  /**
   * 边框
   */
  border: string
  /**
   * 默认的文字颜色
   */
  text: string
  /**
   * 文字的次要颜色，比默认色要淡一些
   */
  textSecondary: string
  /**
   * 描边颜色，用于元素获取焦点时的展示，一般是比主题色更浅的近似色
   */
  outline: string
}

/**
 * 默认色彩
 */
const defaultColor: Color = {
  primary: '#1677ff',
  danger: '#ff4d4f',
  success: '#198754',
  warning: '#ffc107',
  border: '#dee2e6',
  text: '#303133',
  textSecondary: '#909399',
  outline: '#b1d2ff'
}
Object.freeze(defaultColor)

/**
 * 设置的颜色
 */
let specifiedColor: Color | undefined

/**
 * 设置css变量
 */
function setCssVars(color: Color) {
  const { style } = document.body
  style.setProperty('--color-primary', color.primary)
  style.setProperty('--color-danger', color.danger)
  style.setProperty('--color-success', color.success)
  style.setProperty('--color-warning', color.warning)
  style.setProperty('--color-border', color.border)
  style.setProperty('--color-text', color.text)
  style.setProperty('--color-text-secondary', color.textSecondary)
  style.setProperty('--color-outline', color.outline)
  document.body.style.color = color.text
}

setCssVars(defaultColor)

/**
 * 获取颜色
 */
export function getColor(): Color {
  return specifiedColor || defaultColor
}
/**
 * 设置颜色
 */
export function setColor(color: Partial<Color>) {
  const newColor = Object.assign({}, defaultColor)
  for (let property in color) {
    const val = color[property]
    if (!val) {
      continue
    }
    newColor[property] = val
  }
  specifiedColor = Object.freeze(newColor)
  setCssVars(specifiedColor)
}
/**
 * 重置颜色为默认
 */
export function resetColor() {
  setColor(defaultColor)
}
