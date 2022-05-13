import { injectStyles } from '../injectStyles/dist/vanilla-extract-css-injectStyles.esm.js';
import { t as transformCss, _ as _objectSpread2, d as dudupeAndJoinClassList } from './transformCss-2ce771f7.esm.js';
import { setAdapterIfNotSet, getIdentOption, appendCss, registerClassName, registerComposition, markCompositionUsed } from '../adapter/dist/vanilla-extract-css-adapter.esm.js';
import hash from '@emotion/hash';
import { getAndIncrementRefCounter, getFileScope, hasFileScope } from '../fileScope/dist/vanilla-extract-css-fileScope.esm.js';
import { walkObject, get } from '@vanilla-extract/private';
import cssesc from 'cssesc';
import { diff } from 'deep-object-diff';
import chalk from 'chalk';
import { _ as _taggedTemplateLiteral } from './taggedTemplateLiteral-b4c22b04.esm.js';
import outdent from 'outdent';
import deepmerge from 'deepmerge';
import 'escape-string-regexp';
import 'css-what';
import 'css-mediaquery';

var localClassNames = new Set();
var composedClassLists = [];
var bufferedCSSObjs = [];
var browserRuntimeAdapter = {
  appendCss: cssObj => {
    bufferedCSSObjs.push(cssObj);
  },
  registerClassName: className => {
    localClassNames.add(className);
  },
  registerComposition: composition => {
    composedClassLists.push(composition);
  },
  markCompositionUsed: () => {},
  onEndFileScope: fileScope => {
    var css = transformCss({
      localClassNames: Array.from(localClassNames),
      composedClassLists,
      cssObjs: bufferedCSSObjs
    }).join('\n');
    injectStyles({
      fileScope,
      css
    });
    bufferedCSSObjs = [];
  },
  getIdentOption: () => process.env.NODE_ENV === 'production' ? 'short' : 'debug'
};

if (typeof window !== 'undefined') {
  setAdapterIfNotSet(browserRuntimeAdapter);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _wrapRegExp() {
  _wrapRegExp = function (re, groups) {
    return new BabelRegExp(re, undefined, groups);
  };

  var _super = RegExp.prototype;

  var _groups = new WeakMap();

  function BabelRegExp(re, flags, groups) {
    var _this = new RegExp(re, flags);

    _groups.set(_this, groups || _groups.get(re));

    return _setPrototypeOf(_this, BabelRegExp.prototype);
  }

  _inherits(BabelRegExp, RegExp);

  BabelRegExp.prototype.exec = function (str) {
    var result = _super.exec.call(this, str);

    if (result) result.groups = buildGroups(result, this);
    return result;
  };

  BabelRegExp.prototype[Symbol.replace] = function (str, substitution) {
    if (typeof substitution === "string") {
      var groups = _groups.get(this);

      return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) {
        return "$" + groups[name];
      }));
    } else if (typeof substitution === "function") {
      var _this = this;

      return _super[Symbol.replace].call(this, str, function () {
        var args = arguments;

        if (typeof args[args.length - 1] !== "object") {
          args = [].slice.call(args);
          args.push(buildGroups(args, _this));
        }

        return substitution.apply(this, args);
      });
    } else {
      return _super[Symbol.replace].call(this, str, substitution);
    }
  };

  function buildGroups(result, re) {
    var g = _groups.get(re);

    return Object.keys(g).reduce(function (groups, name) {
      groups[name] = result[g[name]];
      return groups;
    }, Object.create(null));
  }

  return _wrapRegExp.apply(this, arguments);
}

function getDevPrefix(debugId) {
  var parts = debugId ? [debugId.replace(/\s/g, '_')] : [];
  var {
    filePath
  } = getFileScope();
  var matches = filePath.match( /*#__PURE__*/_wrapRegExp(/((?:(?![\/\\])[\s\S])*)?[\/\\]?((?:(?![\/\\])[\s\S])*)\.css\.(ts|js|tsx|jsx)$/, {
    dir: 1,
    file: 2
  }));

  if (matches && matches.groups) {
    var {
      dir,
      file
    } = matches.groups;
    parts.unshift(file && file !== 'index' ? file : dir);
  }

  return parts.join('_');
}

function generateIdentifier(debugId) {
  // Convert ref count to base 36 for optimal hash lengths
  var refCount = getAndIncrementRefCounter().toString(36);
  var {
    filePath,
    packageName
  } = getFileScope();
  var fileScopeHash = hash(packageName ? "".concat(packageName).concat(filePath) : filePath);
  var identifier = "".concat(fileScopeHash).concat(refCount);

  if (getIdentOption() === 'debug') {
    var devPrefix = getDevPrefix(debugId);

    if (devPrefix) {
      identifier = "".concat(devPrefix, "__").concat(identifier);
    }
  } else if (filePath.includes('/sprinkles.css.ts')) {
    // Prefix sprinkles with s_, they are already prefixed with spinkles_ in DEV
    identifier = "s_".concat(identifier);
  }

  return identifier.match(/^[0-9]/) ? "_".concat(identifier) : identifier;
}

var normaliseObject = obj => walkObject(obj, () => '');

function validateContract(contract, tokens) {
  var theDiff = diff(normaliseObject(contract), normaliseObject(tokens));
  var valid = Object.keys(theDiff).length === 0;
  return {
    valid,
    diffString: valid ? '' : renderDiff(contract, theDiff)
  };
}

function diffLine(value, nesting, type) {
  var whitespace = [...Array(nesting).keys()].map(() => '  ').join('');
  var line = "".concat(type ? type : ' ').concat(whitespace).concat(value);

  if (process.env.NODE_ENV !== 'test') {
    if (type === '-') {
      return chalk.red(line);
    }

    if (type === '+') {
      return chalk.green(line);
    }
  }

  return line;
}

function renderDiff(orig, diff) {
  var nesting = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var lines = [];

  if (nesting === 0) {
    lines.push(diffLine('{', 0));
  }

  var innerNesting = nesting + 1;
  var keys = Object.keys(diff).sort();

  for (var key of keys) {
    var value = diff[key];

    if (!(key in orig)) {
      lines.push(diffLine("".concat(key, ": ...,"), innerNesting, '+'));
    } else if (typeof value === 'object') {
      lines.push(diffLine("".concat(key, ": {"), innerNesting));
      lines.push(renderDiff(orig[key], diff[key], innerNesting));
      lines.push(diffLine('}', innerNesting));
    } else {
      lines.push(diffLine("".concat(key, ": ...,"), innerNesting, '-'));
    }
  }

  if (nesting === 0) {
    lines.push(diffLine('}', 0));
  }

  return lines.join('\n');
}

function createVar(debugId) {
  // Convert ref count to base 36 for optimal hash lengths
  var refCount = getAndIncrementRefCounter().toString(36);
  var {
    filePath,
    packageName
  } = getFileScope();
  var fileScopeHash = hash(packageName ? "".concat(packageName).concat(filePath) : filePath);
  var varName = getIdentOption() === 'debug' && debugId ? "".concat(debugId, "__").concat(fileScopeHash).concat(refCount) : "".concat(fileScopeHash).concat(refCount);
  var cssVarName = cssesc(varName.match(/^[0-9]/) ? "_".concat(varName) : varName, {
    isIdentifier: true
  });
  return "var(--".concat(cssVarName, ")");
}
function fallbackVar() {
  var finalValue = '';

  for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }

  values.reverse().forEach(value => {
    if (finalValue === '') {
      finalValue = String(value);
    } else {
      if (typeof value !== 'string' || !/^var\(--.*\)$/.test(value)) {
        throw new Error("Invalid variable name: ".concat(value));
      }

      finalValue = value.replace(/\)$/, ", ".concat(finalValue, ")"));
    }
  });
  return finalValue;
}
function assignVars(varContract, tokens) {
  var varSetters = {};
  var {
    valid,
    diffString
  } = validateContract(varContract, tokens);

  if (!valid) {
    throw new Error("Tokens don't match contract.\n".concat(diffString));
  }

  walkObject(tokens, (value, path) => {
    varSetters[get(varContract, path)] = String(value);
  });
  return varSetters;
}
function createThemeContract(tokens) {
  // TS is giving type impossibly deep error here. Ignoring for now as this shouldn't affect consumers.
  // @ts-expect-error
  return walkObject(tokens, (_value, path) => {
    return createVar(path.join('-'));
  });
}
function createGlobalThemeContract(tokens, mapFn) {
  return walkObject(tokens, (value, path) => {
    var rawVarName = typeof mapFn === 'function' ? mapFn(value, path) : value;
    var varName = typeof rawVarName === 'string' ? rawVarName.replace(/^\-\-/, '') : null;

    if (typeof varName !== 'string' || varName !== cssesc(varName, {
      isIdentifier: true
    })) {
      throw new Error("Invalid variable name for \"".concat(path.join('.'), "\": ").concat(varName));
    }

    return "var(--".concat(varName, ")");
  });
}

function createGlobalTheme(selector, arg2, arg3) {
  var shouldCreateVars = Boolean(!arg3);
  var themeVars = shouldCreateVars ? createThemeContract(arg2) : arg2;
  var tokens = shouldCreateVars ? arg2 : arg3;
  appendCss({
    type: 'global',
    selector: selector,
    rule: {
      vars: assignVars(themeVars, tokens)
    }
  }, getFileScope());

  if (shouldCreateVars) {
    return themeVars;
  }
}
function createTheme(arg1, arg2, arg3) {
  var themeClassName = generateIdentifier(typeof arg2 === 'object' ? arg3 : arg2);
  registerClassName(themeClassName);
  var vars = typeof arg2 === 'object' ? createGlobalTheme(themeClassName, arg1, arg2) : createGlobalTheme(themeClassName, arg1);
  return vars ? [themeClassName, vars] : themeClassName;
}

var _templateObject;

function composedStyle(rules, debugId) {
  var className = generateIdentifier(debugId);
  registerClassName(className);
  var classList = [];
  var styleRules = [];

  for (var rule of rules) {
    if (typeof rule === 'string') {
      classList.push(rule);
    } else {
      styleRules.push(rule);
    }
  }

  var result = className;

  if (classList.length > 0) {
    result = "".concat(className, " ").concat(dudupeAndJoinClassList(classList));
    registerComposition({
      identifier: className,
      classList: result
    }); // Always mark as used
    // if (styleRules.length > 0) {
    // If there are styles attached to this composition then it is
    // always used and should never be removed

    markCompositionUsed(className); // }
  }

  if (styleRules.length > 0) {
    var _rule = deepmerge.all(styleRules, {
      // Replace arrays rather than merging
      arrayMerge: (_, sourceArray) => sourceArray
    });

    appendCss({
      type: 'local',
      selector: className,
      rule: _rule
    }, getFileScope());
  }

  return result;
}

function style(rule, debugId) {
  if (Array.isArray(rule)) {
    return composedStyle(rule, debugId);
  }

  var className = generateIdentifier(debugId);
  registerClassName(className);
  appendCss({
    type: 'local',
    selector: className,
    rule
  }, getFileScope());
  return className;
}
/**
 * @deprecated The same functionality is now provided by the 'style' function when you pass it an array
 */

function composeStyles() {
  var compose = hasFileScope() ? composedStyle : dudupeAndJoinClassList;

  for (var _len = arguments.length, classNames = new Array(_len), _key = 0; _key < _len; _key++) {
    classNames[_key] = arguments[_key];
  }

  return compose(classNames);
}
function globalStyle(selector, rule) {
  appendCss({
    type: 'global',
    selector,
    rule
  }, getFileScope());
}
function fontFace(rule, debugId) {
  var fontFamily = "\"".concat(cssesc(generateIdentifier(debugId), {
    quotes: 'double'
  }), "\"");

  if ('fontFamily' in rule) {
    throw new Error(outdent(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n          This function creates and returns a hashed font-family name, so the \"fontFamily\" property should not be provided.\n\n          If you'd like to define a globally scoped custom font, you can use the \"globalFontFace\" function instead.\n        "]))));
  }

  appendCss({
    type: 'fontFace',
    rule: _objectSpread2(_objectSpread2({}, rule), {}, {
      fontFamily
    })
  }, getFileScope());
  return fontFamily;
}
function globalFontFace(fontFamily, rule) {
  appendCss({
    type: 'fontFace',
    rule: _objectSpread2(_objectSpread2({}, rule), {}, {
      fontFamily
    })
  }, getFileScope());
}
function keyframes(rule, debugId) {
  var name = cssesc(generateIdentifier(debugId), {
    isIdentifier: true
  });
  appendCss({
    type: 'keyframes',
    name,
    rule
  }, getFileScope());
  return name;
}
function globalKeyframes(name, rule) {
  appendCss({
    type: 'keyframes',
    name,
    rule
  }, getFileScope());
}
function styleVariants() {
  if (typeof (arguments.length <= 1 ? undefined : arguments[1]) === 'function') {
    var _data = arguments.length <= 0 ? undefined : arguments[0];

    var _mapData = arguments.length <= 1 ? undefined : arguments[1];

    var _debugId = arguments.length <= 2 ? undefined : arguments[2];

    var _classMap = {};

    for (var _key2 in _data) {
      _classMap[_key2] = style(_mapData(_data[_key2], _key2), _debugId ? "".concat(_debugId, "_").concat(_key2) : _key2);
    }

    return _classMap;
  }

  var styleMap = arguments.length <= 0 ? undefined : arguments[0];
  var debugId = arguments.length <= 1 ? undefined : arguments[1];
  var classMap = {};

  for (var _key3 in styleMap) {
    classMap[_key3] = style(styleMap[_key3], debugId ? "".concat(debugId, "_").concat(_key3) : _key3);
  }

  return classMap;
}

export { assignVars, composeStyles, createGlobalTheme, createGlobalThemeContract, createTheme, createThemeContract, createVar, fallbackVar, fontFace, generateIdentifier, globalFontFace, globalKeyframes, globalStyle, keyframes, style, styleVariants };
