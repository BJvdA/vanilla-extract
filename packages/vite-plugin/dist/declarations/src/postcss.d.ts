import type { ResolvedConfig } from 'vite';
import type { ProcessOptions, Plugin } from 'postcss';
export interface PostCSSConfigResult {
    options: ProcessOptions;
    plugins: Plugin[];
}
export declare const resolvePostcssConfig: (config: ResolvedConfig) => Promise<PostCSSConfigResult | null>;
