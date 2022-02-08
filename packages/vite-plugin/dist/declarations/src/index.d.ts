import type { Plugin } from 'vite';
import { IdentifierOption } from '@vanilla-extract/integration';
interface Options {
    identifiers?: IdentifierOption;
}
export declare function vanillaExtractPlugin({ identifiers }?: Options): Plugin;
export {};
