'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var integration = require('@vanilla-extract/integration');
var path = require('path');
var MagicString = require('magic-string');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var MagicString__default = /*#__PURE__*/_interopDefault(MagicString);

/** Generate a CSS bundle from Rollup context */
function generateCssBundle({
  getModuleIds,
  getModuleInfo,
  warn
}) {
  const cssBundle = new MagicString.Bundle();
  const extractedCssIds = new Set();

  // 1. identify CSS files to bundle
  const cssFiles = {};
  for (const id of getModuleIds()) {
    if (integration.cssFileFilter.test(id)) {
      cssFiles[id] = buildImportChain(id, {
        getModuleInfo,
        warn
      });
    }
  }

  // 2. build bundle from import order
  for (const id of sortModules(cssFiles)) {
    const {
      importedIdResolutions
    } = getModuleInfo(id) ?? {};
    for (const resolution of importedIdResolutions ?? []) {
      if (resolution.meta.css && !extractedCssIds.has(resolution.id)) {
        extractedCssIds.add(resolution.id);
        cssBundle.addSource({
          filename: resolution.id,
          content: new MagicString__default["default"](resolution.meta.css)
        });
      }
    }
  }
  return {
    bundle: cssBundle,
    extractedCssIds
  };
}

/** [id, order] tuple meant for ordering imports */

/** Trace a file back through its importers, building an ordered list */
function buildImportChain(id, {
  getModuleInfo,
  warn
}) {
  let mod = getModuleInfo(id);
  if (!mod) {
    return [];
  }
  /** [id, order] */
  const chain = [[id, -1]];
  // resolve upwards to root entry
  while (!mod.isEntry) {
    const {
      id: currentId,
      importers
    } = mod;
    const lastImporterId = importers.at(-1);
    if (!lastImporterId) {
      break;
    }
    if (chain.some(([id]) => id === lastImporterId)) {
      warn(`Circular import detected. Can’t determine ideal import order of module.\n${chain.reverse().join('\n  → ')}`);
      break;
    }
    mod = getModuleInfo(lastImporterId);
    if (!mod) {
      break;
    }
    // importedIds preserves the import order within each module
    chain.push([lastImporterId, mod.importedIds.indexOf(currentId)]);
  }
  return chain.reverse();
}

/** Compare import chains to determine a flat ordering for modules */
function sortModules(modules) {
  const sortedModules = Object.entries(modules);

  // 2. sort CSS by import order
  sortedModules.sort(([_idA, chainA], [_idB, chainB]) => {
    const shorterChain = Math.min(chainA.length, chainB.length);
    for (let i = 0; i < shorterChain; i++) {
      const [moduleA, orderA] = chainA[i];
      const [moduleB, orderB] = chainB[i];
      // on same node, continue to next one
      if (moduleA === moduleB && orderA === orderB) {
        continue;
      }
      if (orderA !== orderB) {
        return orderA - orderB;
      }
    }
    return 0;
  });
  return sortedModules.map(([id]) => id);
}
const SIDE_EFFECT_IMPORT_RE = /^\s*import\s+['"]([^'"]+)['"]\s*;?\s*/gm;

/** Remove specific side effect imports from JS */
function stripSideEffectImportsMatching(code, sources) {
  const matches = code.matchAll(SIDE_EFFECT_IMPORT_RE);
  if (!matches) {
    return code;
  }
  let output = code;
  for (const match of matches) {
    if (!match[1] || !sources.includes(match[1])) {
      continue;
    }
    output = output.replace(match[0], '');
  }
  return output;
}

const {
  relative,
  normalize,
  dirname
} = path.posix;
function vanillaExtractPlugin({
  identifiers,
  cwd = process.cwd(),
  esbuildOptions,
  extract = false
} = {}) {
  const isProduction = process.env.NODE_ENV === 'production';
  let extractedCssIds = new Set(); // only for `extract`

  return {
    name: 'vanilla-extract',
    buildStart() {
      extractedCssIds = new Set(); // refresh every build
    },
    // Transform .css.js to .js
    async transform(_code, id) {
      if (!integration.cssFileFilter.test(id)) {
        return null;
      }
      const [filePath] = id.split('?');
      const identOption = identifiers ?? (isProduction ? 'short' : 'debug');
      const {
        source,
        watchFiles
      } = await integration.compile({
        filePath,
        cwd,
        esbuildOptions,
        identOption
      });
      for (const file of watchFiles) {
        this.addWatchFile(file);
      }
      const output = await integration.processVanillaFile({
        source,
        filePath,
        identOption
      });
      return {
        code: output,
        map: {
          mappings: ''
        }
      };
    },
    // Resolve .css to external module
    async resolveId(id) {
      if (!integration.virtualCssFileFilter.test(id)) {
        return null;
      }
      const {
        fileName,
        source
      } = await integration.getSourceFromVirtualCssFile(id);
      return {
        id: fileName,
        external: true,
        meta: {
          css: source
        }
      };
    },
    // Emit .css assets
    moduleParsed(moduleInfo) {
      moduleInfo.importedIdResolutions.forEach(resolution => {
        if (resolution.meta.css && !extract) {
          resolution.meta.assetId = this.emitFile({
            type: 'asset',
            name: resolution.id,
            source: resolution.meta.css
          });
        }
      });
    },
    // Replace .css import paths with relative paths to emitted css files
    renderChunk(code, chunkInfo) {
      const chunkPath = dirname(chunkInfo.fileName);
      const output = chunkInfo.imports.reduce((codeResult, importPath) => {
        const moduleInfo = this.getModuleInfo(importPath);
        if (!(moduleInfo !== null && moduleInfo !== void 0 && moduleInfo.meta.assetId)) {
          return codeResult;
        }
        const assetPath = this.getFileName(moduleInfo === null || moduleInfo === void 0 ? void 0 : moduleInfo.meta.assetId);
        const relativeAssetPath = `./${normalize(relative(chunkPath, assetPath))}`;
        return codeResult.replace(importPath, relativeAssetPath);
      }, code);
      return {
        code: output,
        map: null
      };
    },
    // Generate bundle (if extracting)
    async buildEnd() {
      if (!extract) {
        return;
      }
      // Note: generateBundle() can’t happen earlier than buildEnd
      // because the graph hasn’t fully settled until this point.
      const {
        bundle,
        extractedCssIds: extractedIds
      } = generateCssBundle(this);
      extractedCssIds = extractedIds;
      const name = extract.name || 'bundle.css';
      this.emitFile({
        type: 'asset',
        name,
        originalFileName: name,
        source: bundle.toString()
      });
      if (extract.sourcemap) {
        const sourcemapName = `${name}.map`;
        this.emitFile({
          type: 'asset',
          name: sourcemapName,
          originalFileName: sourcemapName,
          source: bundle.generateMap({
            file: name,
            includeContent: true
          }).toString()
        });
      }
    },
    // Remove side effect imports (if extracting)
    async generateBundle(_options, bundle) {
      if (!extract) {
        return;
      }
      await Promise.all(Object.entries(bundle).map(async ([id, chunk]) => {
        if (chunk.type === 'chunk' && id.endsWith('.js') && chunk.imports.some(specifier => extractedCssIds.has(specifier))) {
          chunk.code = await stripSideEffectImportsMatching(chunk.code, [...extractedCssIds]);
        }
      }));
    }
  };
}

exports.vanillaExtractPlugin = vanillaExtractPlugin;
