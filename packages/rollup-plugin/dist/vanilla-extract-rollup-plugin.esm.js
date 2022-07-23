import { cssFileFilter, compile, processVanillaFile, virtualCssFileFilter, getSourceFromVirtualCssFile } from '@vanilla-extract/integration';
import { posix } from 'path';

const {
  relative,
  normalize,
  dirname
} = posix;
function vanillaExtractPlugin({
  identifiers,
  cwd = process.cwd(),
  esbuildOptions
} = {}) {
  const emittedFiles = new Map();
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    name: 'vanilla-extract',

    buildStart() {
      emittedFiles.clear();
    },

    async transform(_code, id) {
      if (!cssFileFilter.test(id)) {
        return null;
      }

      const index = id.indexOf('?');
      const filePath = index === -1 ? id : id.substring(0, index);
      const {
        source,
        watchFiles
      } = await compile({
        filePath,
        cwd,
        esbuildOptions
      });

      for (const file of watchFiles) {
        this.addWatchFile(file);
      }

      const output = await processVanillaFile({
        source,
        filePath,
        identOption: identifiers !== null && identifiers !== void 0 ? identifiers : isProduction ? 'short' : 'debug'
      });
      return {
        code: output,
        map: {
          mappings: ''
        }
      };
    },

    async resolveId(id) {
      if (!virtualCssFileFilter.test(id)) {
        return null;
      } // Emit an asset for every virtual css file


      const {
        fileName,
        source
      } = await getSourceFromVirtualCssFile(id);

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
      var _chunkInfo$map;

      // For all imports in this chunk that we have emitted files for...
      const importsToReplace = chunkInfo.imports.filter(fileName => emittedFiles.get(fileName));

      if (!importsToReplace.length) {
        return null;
      } // ...replace import paths with relative paths to emitted css files


      const chunkPath = dirname(chunkInfo.fileName);
      const output = importsToReplace.reduce((codeResult, importPath) => {
        const assetId = emittedFiles.get(importPath);
        const assetName = this.getFileName(assetId);
        const fixedImportPath = `./${normalize(relative(chunkPath, assetName))}`;
        return codeResult.replace(importPath, fixedImportPath);
      }, code);
      return {
        code: output,
        map: (_chunkInfo$map = chunkInfo.map) !== null && _chunkInfo$map !== void 0 ? _chunkInfo$map : null
      };
    }

  };
}

export { vanillaExtractPlugin };
