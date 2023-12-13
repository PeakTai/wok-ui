export type Query = Record<string, string | string[]>;
export declare function parseQueryString(qs: string): Query;
export declare function buildQueryString(qs: Query): string;
