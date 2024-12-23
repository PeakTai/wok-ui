import { Query } from './query-string';
import { AbstractRouterInitOpts, RouteDestination, Router } from './router';
/**
 * h5 历史记录路由.
 */
export declare class HistoryRouter extends Router {
    readonly listener: () => void;
    readonly base?: string;
    constructor(opts: AbstractRouterInitOpts & {
        base?: string;
    });
    parseCurrentUrl(): {
        path: string;
        query?: Query | undefined;
    };
    buildUrl(path: RouteDestination): string;
    push(path: RouteDestination): void;
    replace(path: RouteDestination): void;
    destroy(): void;
}
