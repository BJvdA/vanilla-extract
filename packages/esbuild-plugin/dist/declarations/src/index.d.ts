import { IdentifierOption, CompileOptions } from '@vanilla-extract/integration';
import type { Plugin } from 'esbuild';
interface VanillaExtractPluginOptions {
    outputCss?: boolean;
    /**
     * @deprecated Use `esbuildOptions.external` instead.
     */
    externals?: Array<string>;
    runtime?: boolean;
    processCss?: (css: string) => Promise<string>;
    identifiers?: IdentifierOption;
    esbuildOptions?: CompileOptions['esbuildOptions'];
}
export declare function vanillaExtractPlugin({ outputCss, externals, runtime, processCss, identifiers, esbuildOptions, }?: VanillaExtractPluginOptions): Plugin;
export {};
