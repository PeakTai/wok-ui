/**
 * 路径片段.
 */
export interface PathPart {
    type: 'constant' | 'variable';
    varName?: string;
    value?: string;
}
export declare function parsePathRule(pathRule: string): PathPart[];
export interface PathMatchResult {
    matched: boolean;
    vars?: Record<string, string>;
}
export declare function matchPath(path: string, parts: PathPart[]): PathMatchResult;
export declare function isPathRuleEquals(rule1: PathPart[], rule2: PathPart[]): boolean;
