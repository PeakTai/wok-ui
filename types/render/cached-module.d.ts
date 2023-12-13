import { ConvertibleModule, DivModule } from '../module';
export declare class CachedModule extends DivModule {
    constructor(module: ConvertibleModule);
    /**
     * 销毁，仅仅解除父子关系，不清除内容
     * @returns
     */
    destroy(): void;
    /**
     * 彻底销毁，就是原始的销毁
     */
    destroyThoroughly(): void;
}
