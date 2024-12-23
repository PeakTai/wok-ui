import { Query } from './query-string';
import { AbstractRouterInitOpts, RouteDestination, Router } from './router';
/**
 * 哈希路由.
 */
export declare class HashRouter extends Router {
    private readonly listener;
    constructor(opts: AbstractRouterInitOpts);
    parseCurrentUrl(): {
        path: string;
        query?: Query | undefined;
    };
    buildUrl(path: RouteDestination): string;
    push(path: RouteDestination): void;
    replace(path: RouteDestination): void;
    destroy(): void;
}
