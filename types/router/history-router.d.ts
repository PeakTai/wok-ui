import { Query } from './query-string';
import { Router, RouterRule } from './router';
/**
 * h5 历史记录路由.
 */
export declare class HistoryRouter extends Router {
    readonly listener: () => void;
    readonly base?: string;
    constructor(opts: {
        rules: RouterRule[];
        base?: string;
        cacheLimit?: number;
    });
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
