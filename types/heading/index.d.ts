import { ColorKey } from '../color';
import { Module, SubModulesOpt } from '../module';
type HeadingTextOpts = string | {
    content: SubModulesOpt;
    color?: ColorKey;
};
declare abstract class Heading extends Module {
    constructor(tag: keyof HTMLElementTagNameMap, text: HeadingTextOpts);
}
/**
 * 一级标题
 */
export declare class H1 extends Heading {
    constructor(text: HeadingTextOpts);
}
/**
 * 二级标题
 */
export declare class H2 extends Heading {
    constructor(text: HeadingTextOpts);
}
/**
 * 三级标题
 */
export declare class H3 extends Heading {
    constructor(text: HeadingTextOpts);
}
/**
 * 四级标题
 */
export declare class H4 extends Heading {
    constructor(text: HeadingTextOpts);
}
/**
 * 五级标题
 */
export declare class H5 extends Heading {
    constructor(text: HeadingTextOpts);
}
/**
 * 六级标题
 */
export declare class H6 extends Heading {
    constructor(text: HeadingTextOpts);
}
export {};
