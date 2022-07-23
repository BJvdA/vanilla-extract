import type { Plugin } from 'vite';
import { IdentifierOption, CompileOptions } from '@vanilla-extract/integration';
interface Options {
    identifiers?: IdentifierOption;
    esbuildOptions?: CompileOptions['esbuildOptions'];
}
export declare function vanillaExtractPlugin({ identifiers, esbuildOptions, }?: Options): Plugin;
export {};
