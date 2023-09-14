/**
 * 路径片段.
 */
export interface PathPart {
  type: 'constant' | 'variable'
  varName?: string
  value?: string
}

export function parsePathRule(pathRule: string): PathPart[] {
  const ps = pathRule.split('/').filter(p => !!p)
  return ps.map<PathPart>(p => {
    if (p.startsWith(':')) {
      const varName = p.substring(1)
      return { type: 'variable', varName }
    }
    return { type: 'constant', value: p }
  })
}

export interface PathMatchResult {
  matched: boolean
  vars?: Record<string, string>
}

export function matchPath(path: string, parts: PathPart[]): PathMatchResult {
  const ps = path.split('/').filter(p => !!p)
  if (ps.length !== parts.length) {
    return { matched: false }
  }
  const vars: Record<string, string> = {}
  for (let i = 0; i < ps.length; i++) {
    const part = parts[i]
    const p = ps[i]
    if (part.type === 'constant') {
      if (part.value !== p) {
        return { matched: false }
      }
      continue
    }
    if (part.varName) vars[part.varName] = p
  }
  return { matched: true, vars }
}

export function isPathRuleEquals(rule1: PathPart[], rule2: PathPart[]): boolean {
  if (rule1.length !== rule2.length) {
    return false
  }
  for (let i = 0; i < rule1.length; i++) {
    const p1 = rule1[i]
    const p2 = rule2[i]
    if (p1.type !== p2.type) {
      return false
    }
    if (p1.type === 'constant') {
      if (p1.value !== p2.value) {
        return false
      }
    }
  }
  return true
}
