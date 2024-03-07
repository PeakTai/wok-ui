import { Query } from './query-string';
import { Router, RouterRule } from './router';
/**
 * 哈希路由.
 */
export declare class HashRouter extends Router {
    private readonly listener;
    constructor(rules: RouterRule[], cacheLimit?: number);
    parseCurrentUrl(): {
        path: string;
        query?: Query | undefined;
    };
    buildUrl(path: string | {
        path: string;
        query: Query;
    }): string;
    push(path: string | {
        path: string;
        query: Query;
    }): void;
    replace(path: string | {
        path: string;
        query: Query;
    }): void;
    destroy(): void;
}
