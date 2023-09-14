export function generateRandomColor(): string {
  // 生成随机的R、G、B分量的值
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)

  // 将R、G、B分量的值转换为十六进制字符串，并拼成颜色值
  const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
    .toString(16)
    .padStart(2, '0')}`

  return hex
}
