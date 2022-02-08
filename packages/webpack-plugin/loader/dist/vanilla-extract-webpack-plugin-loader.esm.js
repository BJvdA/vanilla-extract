import path from 'path';
import loaderUtils from 'loader-utils';
import { addFileScope, processVanillaFile } from '@vanilla-extract/integration';
import createDebug from 'debug';
import chalk from 'chalk';

const formatResourcePath = i => chalk.blue(`"${i.replace(/.*\//, '')}"`);

createDebug.formatters.r = r => formatResourcePath(r);

const debug = createDebug;

const emptyCssExtractionFile = require.resolve(path.join(path.dirname(require.resolve('../../package.json')), 'extracted'));

function loader (source) {
  this.cacheable(true);
  const {
    packageInfo
  } = loaderUtils.getOptions(this);
  return addFileScope({
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
      serializeVirtualCssPath: ({
        fileName,
        base64Source
      }) => {
        const virtualResourceLoader = `${require.resolve('virtual-resource-loader')}?${JSON.stringify({
          source: base64Source
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
