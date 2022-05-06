import path from 'path';
import loaderUtils from 'loader-utils';
import { addFileScope, processVanillaFile, serializeCss } from '@vanilla-extract/integration';
import createDebug from 'debug';
import chalk from 'chalk';

const formatResourcePath = i => chalk.blue(`"${i.replace(/.*\//, '')}"`);

createDebug.formatters.r = r => formatResourcePath(r);

const debug = createDebug;

const virtualLoader = require.resolve(path.join(path.dirname(require.resolve('../../package.json')), 'virtualFileLoader'));

const emptyCssExtractionFile = require.resolve(path.join(path.dirname(require.resolve('../../package.json')), 'extracted'));

function loader (source) {
  this.cacheable(true);
  return addFileScope({
    source,
    filePath: this.resourcePath,
    rootPath: this.rootContext
  });
}
function pitch() {
  this.cacheable(true);
  const {
    childCompiler,
    outputCss,
    identifiers
  } = loaderUtils.getOptions(this);
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
    const result = await processVanillaFile({
      source,
      outputCss,
      filePath: this.resourcePath,
      identOption: identifiers !== null && identifiers !== void 0 ? identifiers : this.mode === 'production' ? 'short' : 'debug',
      serializeVirtualCssPath: async ({
        fileName,
        source
      }) => {
        const serializedCss = await serializeCss(source);
        const virtualResourceLoader = `${virtualLoader}?${JSON.stringify({
          fileName: fileName,
          source: serializedCss
        })}`;
        const request = loaderUtils.stringifyRequest(this, `${fileName}!=!${virtualResourceLoader}!${emptyCssExtractionFile}`);
        return `import ${request}`;
      }
    });
    log('Completed successfully');
    callback(null, result);
  }).catch(e => {
    callback(e);
  });
}

export { loader as default, pitch };