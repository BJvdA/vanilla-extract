'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var integration = require('@vanilla-extract/integration');
var path = require('path');

function vanillaExtractPlugin({
  identifiers,
  cwd = process.cwd()
} = {}) {
  const emittedFiles = new Map();
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    name: 'vanilla-extract',

    async transform(_code, id) {
      if (!integration.cssFileFilter.test(id)) {
        return null;
      }

      const index = id.indexOf('?');
      const filePath = index === -1 ? id : id.substring(0, index);
      const {
        source,
        watchFiles
      } = await integration.compile({
        filePath,
        cwd
      });

      for (const file of watchFiles) {
        this.addWatchFile(file);
      }

      return integration.processVanillaFile({
        source,
        filePath,
        identOption: identifiers !== null && identifiers !== void 0 ? identifiers : isProduction ? 'short' : 'debug'
      });
    },

    async resolveId(id) {
      if (!integration.virtualCssFileFilter.test(id)) {
        return null;
      } // Emit an asset for every virtual css file


      const {
        fileName,
        source
      } = await integration.getSourceFromVirtualCssFile(id);

      if (!emittedFiles.get(fileName)) {
        const assetId = this.emitFile({
          type: 'asset',
          name: fileName,
          source
        });
        emittedFiles.set(fileName, assetId);
      } // Resolve to a temporary external module


      return {
        id: fileName,
        external: true
      };
    },

    renderChunk(code, chunkInfo) {
      // For all imports in this chunk that we have emitted files for...
      const importsToReplace = chunkInfo.imports.filter(fileName => emittedFiles.get(fileName));

      if (!importsToReplace.length) {
        return null;
      } // ...replace import paths with relative paths to emitted css files


      const chunkPath = path.dirname(chunkInfo.fileName);
      return importsToReplace.reduce((codeResult, importPath) => {
        const assetId = emittedFiles.get(importPath);
        const assetName = this.getFileName(assetId);
        const fixedImportPath = `./${path.normalize(path.relative(chunkPath, assetName))}`;
        return codeResult.replace(importPath, fixedImportPath);
      }, code);
    }

  };
}

exports.vanillaExtractPlugin = vanillaExtractPlugin;
