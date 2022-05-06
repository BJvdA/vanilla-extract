import type { Plugin } from 'rollup';
import { IdentifierOption } from '@vanilla-extract/integration';
interface Options {
    identifiers?: IdentifierOption;
    cwd?: string;
}
export declare function vanillaExtractPlugin({ identifiers, cwd, }?: Options): Plugin;
export {};
