import { Module } from '../module';
/**
 * 代理被缓存的模块
 * @param module 要缓存的模块
 */
export declare function proxyCachedModule<T extends Module>(module: T): T;
