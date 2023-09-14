/**
 * 生成id，用于一些特殊情况需要给元素一个随机的唯一的 id
 * @returns
 */
export function generateId(): string {
  const timestamp: number = new Date().getTime() // 获取当前时间戳
  const random = Math.floor(Math.random() * 100000000) // 随机数
  return `${timestamp.toString(36)}${random.toString(36)}` // 拼接成 ID
}
