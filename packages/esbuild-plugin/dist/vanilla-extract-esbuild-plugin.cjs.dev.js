'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var integration = require('@vanilla-extract/integration');

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
    return integration.vanillaExtractFilescopePlugin();
  }

  return {
    name: 'vanilla-extract',

    setup(build) {
      build.onResolve({
        filter: integration.virtualCssFileFilter
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
        path: path$1
      }) => {
        var _build$initialOptions;

        let {
          source,
          fileName
        } = await integration.getSourceFromVirtualCssFile(path$1);

        if (typeof processCss === 'function') {
          source = await processCss(source);
        }

        const rootDir = (_build$initialOptions = build.initialOptions.absWorkingDir) !== null && _build$initialOptions !== void 0 ? _build$initialOptions : process.cwd();
        const resolveDir = path.dirname(path.join(rootDir, fileName));
        return {
          contents: source,
          loader: 'css',
          resolveDir
        };
      });
      build.onLoad({
        filter: integration.cssFileFilter
      }, async ({
        path
      }) => {
        const {
          source,
          watchFiles
        } = await integration.compile({
          filePath: path,
          externals,
          cwd: build.initialOptions.absWorkingDir
        });
        const contents = await integration.processVanillaFile({
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

exports.vanillaExtractPlugin = vanillaExtractPlugin;
