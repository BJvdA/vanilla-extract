'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var loaderUtils = require('loader-utils');
var integration = require('@vanilla-extract/integration');
var createDebug = require('debug');
var chalk = require('chalk');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefault(path);
var loaderUtils__default = /*#__PURE__*/_interopDefault(loaderUtils);
var createDebug__default = /*#__PURE__*/_interopDefault(createDebug);
var chalk__default = /*#__PURE__*/_interopDefault(chalk);

const formatResourcePath = i => chalk__default["default"].blue(`"${i.replace(/.*\//, '')}"`);

createDebug__default["default"].formatters.r = r => formatResourcePath(r);

const debug = createDebug__default["default"];

const emptyCssExtractionFile = require.resolve(path__default["default"].join(path__default["default"].dirname(require.resolve('../../package.json')), 'extracted'));

function loader (source) {
  this.cacheable(true);
  const {
    packageInfo
  } = loaderUtils__default["default"].getOptions(this);
  return integration.addFileScope({
    source,
    filePath: this.resourcePath,
    packageInfo
  }).source;
}
function pitch() {
  this.cacheable(true);
  const {
    childCompiler,
    outputCss,
    identifiers
  } = loaderUtils__default["default"].getOptions(this);
  const log = debug(`vanilla-extract:loader:${formatResourcePath(this.resourcePath)}`);
  const compiler = this._compiler;
  const isChildCompiler = childCompiler.isChildCompiler(compiler.name);

  if (isChildCompiler) {
    log('Skip vanilla-extract loader as we are already within a child compiler for %s', compiler.options.output.filename);
    return;
  }

  log('Loading file');
  const callback = this.async();
  childCompiler.getCompiledSource(this).then(async ({
    source
  }) => {
    const result = await integration.processVanillaFile({
      source,
      outputCss,
      filePath: this.resourcePath,
      identOption: identifiers !== null && identifiers !== void 0 ? identifiers : this.mode === 'production' ? 'short' : 'debug',
      serializeVirtualCssPath: ({
        fileName,
        base64Source
      }) => {
        const virtualResourceLoader = `${require.resolve('virtual-resource-loader')}?${JSON.stringify({
          source: base64Source
        })}`;
        const request = loaderUtils__default["default"].stringifyRequest(this, `${fileName}!=!${virtualResourceLoader}!${emptyCssExtractionFile}`);
        return `import ${request}`;
      }
    });
    log('Completed successfully');
    callback(null, result);
  }).catch(e => {
    callback(e);
  });
}

exports["default"] = loader;
exports.pitch = pitch;
