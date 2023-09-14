export type Query = Record<string, string | string[]>

export function parseQueryString(qs: string): Query {
  const queryString: Query = {}
  const kvs = qs.split('&')
  kvs.forEach(kv => {
    if (!kv) {
      return
    }
    const arr = kv.split('=')
    if (arr.length !== 2) {
      return
    }
    const paramName = decodeURIComponent(arr[0])
    const value = decodeURIComponent(arr[1])
    if (!queryString[paramName]) {
      queryString[paramName] = value
      return
    }
    const exVal = queryString[paramName]
    if (typeof exVal === 'string') {
      queryString[paramName] = [exVal, value]
      return
    }
    exVal.push(value)
  })
  return queryString
}

export function buildQueryString(qs: Query): string {
  const arr: string[] = []
  for (const key in qs) {
    const val = qs[key]
    if (typeof val === 'string') {
      arr.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
      continue
    }
    val.forEach(v => {
      arr.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
    })
  }
  return arr.join('&')
}
