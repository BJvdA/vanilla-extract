import { dirname, join } from 'path';
import { vanillaExtractFilescopePlugin, virtualCssFileFilter, getSourceFromVirtualCssFile, cssFileFilter, compile, processVanillaFile } from '@vanilla-extract/integration';

const vanillaCssNamespace = 'vanilla-extract-css-ns';
function vanillaExtractPlugin({
  outputCss,
  externals = [],
  runtime = false,
  processCss,
  identifiers
} = {}) {
  if (runtime) {
    // If using runtime CSS then just apply fileScopes to code
    return vanillaExtractFilescopePlugin();
  }

  return {
    name: 'vanilla-extract',

    setup(build) {
      build.onResolve({
        filter: virtualCssFileFilter
      }, args => {
        return {
          path: args.path,
          namespace: vanillaCssNamespace
        };
      });
      build.onLoad({
        filter: /.*/,
        namespace: vanillaCssNamespace
      }, async ({
        path
      }) => {
        var _build$initialOptions;

        let {
          source,
          fileName
        } = await getSourceFromVirtualCssFile(path);

        if (typeof processCss === 'function') {
          source = await processCss(source);
        }

        const rootDir = (_build$initialOptions = build.initialOptions.absWorkingDir) !== null && _build$initialOptions !== void 0 ? _build$initialOptions : process.cwd();
        const resolveDir = dirname(join(rootDir, fileName));
        return {
          contents: source,
          loader: 'css',
          resolveDir
        };
      });
      build.onLoad({
        filter: cssFileFilter
      }, async ({
        path
      }) => {
        const {
          source,
          watchFiles
        } = await compile({
          filePath: path,
          externals,
          cwd: build.initialOptions.absWorkingDir
        });
        const contents = await processVanillaFile({
          source,
          filePath: path,
          outputCss,
          identOption: identifiers !== null && identifiers !== void 0 ? identifiers : build.initialOptions.minify ? 'short' : 'debug'
        });
        return {
          contents,
          loader: 'js',
          watchFiles
        };
      });
    }

  };
}

export { vanillaExtractPlugin };
