import type { Plugin } from 'rollup';
import { type IdentifierOption, type CompileOptions } from '@vanilla-extract/integration';
export interface Options {
    /**
     * Different formatting of identifiers (e.g. class names, keyframes, CSS Vars, etc) can be configured by selecting from the following options:
     * - "short": 7+ character hash. e.g. hnw5tz3
     * - "debug": human readable prefixes representing the owning filename and a potential rule level debug name. e.g. myfile_mystyle_hnw5tz3
     * - custom function: takes an object parameter with `hash`, `filePath`, `debugId`, and `packageName`, and returns a customized identifier.
     * @default "short"
     * @example ({ hash }) => `prefix_${hash}`
     */
    identifiers?: IdentifierOption;
    /**
     * Current working directory
     * @default process.cwd()
     */
    cwd?: string;
    /**
     * Options forwarded to esbuild
     * @see https://esbuild.github.io/
     */
    esbuildOptions?: CompileOptions['esbuildOptions'];
    /**
     * Extract .css bundle to a specified filename
     * @default false
     */
    extract?: {
        /**
         * Name of emitted .css file.
         * @default "bundle.css"
         */
        name?: string;
        /**
         * Generate a .css.map file?
         * @default false
         */
        sourcemap?: boolean;
    } | false;
}
export declare function vanillaExtractPlugin({ identifiers, cwd, esbuildOptions, extract, }?: Options): Plugin;
