'use strict';

var _private = require('@vanilla-extract/private');
var cssesc = require('cssesc');
var escapeStringRegexp = require('escape-string-regexp');
var adapter_dist_vanillaExtractCssAdapter = require('../adapter/dist/vanilla-extract-css-adapter.cjs.prod.js');
var taggedTemplateLiteral = require('./taggedTemplateLiteral-bd61be83.cjs.prod.js');
var cssWhat = require('css-what');
var outdent = require('outdent');
var cssMediaquery = require('css-mediaquery');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var cssesc__default = /*#__PURE__*/_interopDefault(cssesc);
var escapeStringRegexp__default = /*#__PURE__*/_interopDefault(escapeStringRegexp);
var outdent__default = /*#__PURE__*/_interopDefault(outdent);

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function forEach(obj, fn) {
  for (var _key in obj) {
    fn(obj[_key], _key);
  }
}
function omit(obj, omitKeys) {
  var result = {};

  for (var _key2 in obj) {
    if (omitKeys.indexOf(_key2) === -1) {
      result[_key2] = obj[_key2];
    }
  }

  return result;
}
function mapKeys(obj, fn) {
  var result = {};

  for (var _key3 in obj) {
    result[fn(obj[_key3], _key3)] = obj[_key3];
  }

  return result;
}

function composeStylesIntoSet(set) {
  for (var _len = arguments.length, classNames = new Array(_len > 1 ? _len - 1 : 0), _key5 = 1; _key5 < _len; _key5++) {
    classNames[_key5 - 1] = arguments[_key5];
  }

  for (var className of classNames) {
    if (className.length === 0) {
      continue;
    }

    if (typeof className === 'string') {
      if (className.includes(' ')) {
        composeStylesIntoSet(set, ...className.trim().split(' '));
      } else {
        set.add(className);
      }
    } else if (Array.isArray(className)) {
      composeStylesIntoSet(set, ...className);
    }
  }
}

function dudupeAndJoinClassList(classNames) {
  var set = new Set();
  composeStylesIntoSet(set, ...classNames);
  return Array.from(set).join(' ');
}

var _templateObject$1;

function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

var validateSelector = (selector, targetClassName) => {
  var replaceTarget = () => {
    var targetRegex = new RegExp(".".concat(escapeRegex(cssesc__default["default"](targetClassName, {
      isIdentifier: true
    }))), 'g');
    return selector.replace(targetRegex, '&');
  };

  var selectorParts;

  try {
    selectorParts = cssWhat.parse(selector);
  } catch (err) {
    throw new Error("Invalid selector: ".concat(replaceTarget()));
  }

  selectorParts.forEach(tokens => {
    try {
      for (var i = tokens.length - 1; i >= -1; i--) {
        if (!tokens[i]) {
          throw new Error();
        }

        var token = tokens[i];

        if (token.type === 'child' || token.type === 'parent' || token.type === 'sibling' || token.type === 'adjacent' || token.type === 'descendant') {
          throw new Error();
        }

        if (token.type === 'attribute' && token.name === 'class' && token.value === targetClassName) {
          return; // Found it
        }
      }
    } catch (err) {
      throw new Error(outdent__default["default"](_templateObject$1 || (_templateObject$1 = taggedTemplateLiteral._taggedTemplateLiteral(["\n        Invalid selector: ", "\n    \n        Style selectors must target the '&' character (along with any modifiers), e.g. ", " or ", ".\n        \n        This is to ensure that each style block only affects the styling of a single class.\n        \n        If your selector is targeting another class, you should move it to the style definition for that class, e.g. given we have styles for 'parent' and 'child' elements, instead of adding a selector of ", ") to 'parent', you should add ", " to 'child').\n        \n        If your selector is targeting something global, use the 'globalStyle' function instead, e.g. if you wanted to write ", ", you should instead write 'globalStyle(", ", { ... })'\n      "])), replaceTarget(), '`${parent} &`', '`${parent} &:hover`', '`& ${child}`', '`${parent} &`', '`& h1`', '`${parent} h1`'));
    }
  });
};

class ConditionalRuleset {
  /**
   * Stores information about where conditions must in relation to other conditions
   *
   * e.g. mobile -> tablet, desktop
   */
  constructor() {
    this.ruleset = [];
    this.precedenceLookup = new Map();
  }

  findOrCreateCondition(conditionQuery) {
    var targetCondition = this.ruleset.find(cond => cond.query === conditionQuery);

    if (!targetCondition) {
      // No target condition so create one
      targetCondition = {
        query: conditionQuery,
        rules: [],
        children: new ConditionalRuleset()
      };
      this.ruleset.push(targetCondition);
    }

    return targetCondition;
  }

  getConditionalRulesetByPath(conditionPath) {
    var currRuleset = this;

    for (var query of conditionPath) {
      var condition = currRuleset.findOrCreateCondition(query);
      currRuleset = condition.children;
    }

    return currRuleset;
  }

  addRule(rule, conditionQuery, conditionPath) {
    var ruleset = this.getConditionalRulesetByPath(conditionPath);
    var targetCondition = ruleset.findOrCreateCondition(conditionQuery);

    if (!targetCondition) {
      throw new Error('Failed to add conditional rule');
    }

    targetCondition.rules.push(rule);
  }

  addConditionPrecedence(conditionPath, conditionOrder) {
    var ruleset = this.getConditionalRulesetByPath(conditionPath);

    for (var i = 0; i < conditionOrder.length; i++) {
      var _ruleset$precedenceLo;

      var condition = conditionOrder[i];
      var conditionPrecedence = (_ruleset$precedenceLo = ruleset.precedenceLookup.get(condition)) !== null && _ruleset$precedenceLo !== void 0 ? _ruleset$precedenceLo : new Set();

      for (var lowerPrecedenceCondition of conditionOrder.slice(i + 1)) {
        conditionPrecedence.add(lowerPrecedenceCondition);
      }

      ruleset.precedenceLookup.set(condition, conditionPrecedence);
    }
  }

  isCompatible(incomingRuleset) {
    var _this = this;

    for (var [condition, orderPrecedence] of this.precedenceLookup.entries()) {
      for (var lowerPrecedenceCondition of orderPrecedence) {
        var _incomingRuleset$prec;

        if ((_incomingRuleset$prec = incomingRuleset.precedenceLookup.get(lowerPrecedenceCondition)) !== null && _incomingRuleset$prec !== void 0 && _incomingRuleset$prec.has(condition)) {
          return false;
        }
      }
    } // Check that children are compatible


    var _loop = function _loop(query, children) {
      var matchingCondition = _this.ruleset.find(cond => cond.query === query);

      if (matchingCondition && !matchingCondition.children.isCompatible(children)) {
        return {
          v: false
        };
      }
    };

    for (var {
      query,
      children
    } of incomingRuleset.ruleset) {
      var _ret = _loop(query, children);

      if (typeof _ret === "object") return _ret.v;
    }

    return true;
  }

  merge(incomingRuleset) {
    var _this2 = this;

    var _loop2 = function _loop2(query, rules, children) {
      var matchingCondition = _this2.ruleset.find(cond => cond.query === query);

      if (matchingCondition) {
        matchingCondition.rules.push(...rules);
        matchingCondition.children.merge(children);
      } else {
        _this2.ruleset.push({
          query,
          rules,
          children
        });
      }
    };

    // Merge rulesets into one array
    for (var {
      query,
      rules,
      children
    } of incomingRuleset.ruleset) {
      _loop2(query, rules, children);
    } // Merge order precedences


    for (var [condition, incomingOrderPrecedence] of incomingRuleset.precedenceLookup.entries()) {
      var _this$precedenceLooku;

      var orderPrecedence = (_this$precedenceLooku = this.precedenceLookup.get(condition)) !== null && _this$precedenceLooku !== void 0 ? _this$precedenceLooku : new Set();
      this.precedenceLookup.set(condition, new Set([...orderPrecedence, ...incomingOrderPrecedence]));
    }
  }
  /**
   * Merge another ConditionalRuleset into this one if they are compatible
   *
   * @returns true if successful, false if the ruleset is incompatible
   */


  mergeIfCompatible(incomingRuleset) {
    if (!this.isCompatible(incomingRuleset)) {
      return false;
    }

    this.merge(incomingRuleset);
    return true;
  }

  sort() {
    this.ruleset.sort((a, b) => {
      var aWeights = this.precedenceLookup.get(a.query);

      if (aWeights !== null && aWeights !== void 0 && aWeights.has(b.query)) {
        // A is higher precedence
        return -1;
      }

      var bWeights = this.precedenceLookup.get(b.query);

      if (bWeights !== null && bWeights !== void 0 && bWeights.has(a.query)) {
        // B is higher precedence
        return 1;
      }

      return 0;
    });
  }

  renderToArray() {
    // Sort rulesets according to required rule order
    this.sort();
    var arr = [];

    for (var {
      query,
      rules,
      children
    } of this.ruleset) {
      var selectors = {};

      for (var rule of rules) {
        selectors[rule.selector] = rule.rule;
      }

      Object.assign(selectors, ...children.renderToArray());
      arr.push({
        [query]: selectors
      });
    }

    return arr;
  }

}

var simplePseudoMap = {
  ':-moz-any-link': true,
  ':-moz-full-screen': true,
  ':-moz-placeholder': true,
  ':-moz-read-only': true,
  ':-moz-read-write': true,
  ':-ms-fullscreen': true,
  ':-ms-input-placeholder': true,
  ':-webkit-any-link': true,
  ':-webkit-full-screen': true,
  '::-moz-placeholder': true,
  '::-moz-progress-bar': true,
  '::-moz-range-progress': true,
  '::-moz-range-thumb': true,
  '::-moz-range-track': true,
  '::-moz-selection': true,
  '::-ms-backdrop': true,
  '::-ms-browse': true,
  '::-ms-check': true,
  '::-ms-clear': true,
  '::-ms-fill': true,
  '::-ms-fill-lower': true,
  '::-ms-fill-upper': true,
  '::-ms-reveal': true,
  '::-ms-thumb': true,
  '::-ms-ticks-after': true,
  '::-ms-ticks-before': true,
  '::-ms-tooltip': true,
  '::-ms-track': true,
  '::-ms-value': true,
  '::-webkit-backdrop': true,
  '::-webkit-input-placeholder': true,
  '::-webkit-progress-bar': true,
  '::-webkit-progress-inner-value': true,
  '::-webkit-progress-value': true,
  '::-webkit-resizer': true,
  '::-webkit-scrollbar-button': true,
  '::-webkit-scrollbar-corner': true,
  '::-webkit-scrollbar-thumb': true,
  '::-webkit-scrollbar-track-piece': true,
  '::-webkit-scrollbar-track': true,
  '::-webkit-scrollbar': true,
  '::-webkit-slider-runnable-track': true,
  '::-webkit-slider-thumb': true,
  '::after': true,
  '::backdrop': true,
  '::before': true,
  '::cue': true,
  '::first-letter': true,
  '::first-line': true,
  '::grammar-error': true,
  '::placeholder': true,
  '::selection': true,
  '::spelling-error': true,
  ':active': true,
  ':after': true,
  ':any-link': true,
  ':before': true,
  ':blank': true,
  ':checked': true,
  ':default': true,
  ':defined': true,
  ':disabled': true,
  ':empty': true,
  ':enabled': true,
  ':first': true,
  ':first-child': true,
  ':first-letter': true,
  ':first-line': true,
  ':first-of-type': true,
  ':focus': true,
  ':focus-visible': true,
  ':focus-within': true,
  ':fullscreen': true,
  ':hover': true,
  ':in-range': true,
  ':indeterminate': true,
  ':invalid': true,
  ':last-child': true,
  ':last-of-type': true,
  ':left': true,
  ':link': true,
  ':only-child': true,
  ':only-of-type': true,
  ':optional': true,
  ':out-of-range': true,
  ':placeholder-shown': true,
  ':read-only': true,
  ':read-write': true,
  ':required': true,
  ':right': true,
  ':root': true,
  ':scope': true,
  ':target': true,
  ':valid': true,
  ':visited': true
};
var simplePseudos = Object.keys(simplePseudoMap);
var simplePseudoLookup = simplePseudoMap;

var _templateObject;
var mediaTypes = ['all', 'print', 'screen'];
var validateMediaQuery = mediaQuery => {
  var _parse;

  var {
    type,
    expressions
  } = (_parse = cssMediaquery.parse(mediaQuery)) === null || _parse === void 0 ? void 0 : _parse[0];
  var isAllQuery = mediaQuery === 'all';
  var isValidType = mediaTypes.includes(type); // If the parser returns all for the type, we should have expressions
  // or the query should match 'all' otherwise it is invalid

  if (!isValidType || !isAllQuery && type === 'all' && !expressions.length) {
    throw new Error(outdent__default["default"](_templateObject || (_templateObject = taggedTemplateLiteral._taggedTemplateLiteral(["\n      Invalid media query: ", "\n\n      A media query can contain an optional media type and any number of media feature expressions.\n  \n      Read more on MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries\n    "])), mediaQuery));
  }
};

var _excluded = ["vars"],
    _excluded2 = ["content"];
var UNITLESS = {
  animationIterationCount: true,
  borderImage: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexShrink: true,
  fontWeight: true,
  gridArea: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnStart: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowStart: true,
  initialLetter: true,
  lineClamp: true,
  lineHeight: true,
  maxLines: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  WebkitLineClamp: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // svg properties
  fillOpacity: true,
  floodOpacity: true,
  maskBorder: true,
  maskBorderOutset: true,
  maskBorderSlice: true,
  maskBorderWidth: true,
  shapeImageThreshold: true,
  stopOpacity: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};

function dashify(str) {
  return str.replace(/([A-Z])/g, '-$1').replace(/^ms-/, '-ms-').toLowerCase();
}

var DOUBLE_SPACE = '  ';
var specialKeys = [...simplePseudos, '@media', '@supports', 'selectors'];

class Stylesheet {
  constructor(localClassNames, composedClassLists) {
    this.rules = [];
    this.conditionalRulesets = [new ConditionalRuleset()];
    this.fontFaceRules = [];
    this.keyframesRules = [];
    this.localClassNameRegex = localClassNames.length > 0 ? RegExp("(".concat(localClassNames.map(escapeStringRegexp__default["default"]).join('|'), ")"), 'g') : null; // Class list compositions should be priortized by Newer > Older
    // Therefore we reverse the array as they are added in sequence

    this.composedClassLists = composedClassLists.map(_ref => {
      var {
        identifier,
        classList
      } = _ref;
      return {
        identifier,
        regex: RegExp("(".concat(classList, ")"), 'g')
      };
    }).reverse();
  }

  processCssObj(root) {
    if (root.type === 'fontFace') {
      this.fontFaceRules.push(root.rule);
      return;
    }

    if (root.type === 'keyframes') {
      this.keyframesRules.push(root);
      return;
    } // Add main styles


    var mainRule = omit(root.rule, specialKeys);
    this.addRule({
      selector: root.selector,
      rule: mainRule
    });
    this.currConditionalRuleset = new ConditionalRuleset();
    this.transformMedia(root, root.rule['@media']);
    this.transformSupports(root, root.rule['@supports']);
    this.transformSimplePseudos(root, root.rule);
    this.transformSelectors(root, root.rule);
    var activeConditionalRuleset = this.conditionalRulesets[this.conditionalRulesets.length - 1];

    if (!activeConditionalRuleset.mergeIfCompatible(this.currConditionalRuleset)) {
      // Ruleset merge failed due to incompatibility. We now deopt by starting a fresh ConditionalRuleset
      this.conditionalRulesets.push(this.currConditionalRuleset);
    }
  }

  addConditionalRule(cssRule, conditions) {
    // Run `pixelifyProperties` before `transformVars` as we don't want to pixelify CSS Vars
    var rule = this.transformVars(this.transformContent(this.pixelifyProperties(cssRule.rule)));
    var selector = this.transformSelector(cssRule.selector);

    if (!this.currConditionalRuleset) {
      throw new Error("Couldn't add conditional rule");
    }

    var conditionQuery = conditions[conditions.length - 1];
    var parentConditions = conditions.slice(0, conditions.length - 1);
    this.currConditionalRuleset.addRule({
      selector,
      rule
    }, conditionQuery, parentConditions);
  }

  addRule(cssRule) {
    // Run `pixelifyProperties` before `transformVars` as we don't want to pixelify CSS Vars
    var rule = this.transformVars(this.transformContent(this.pixelifyProperties(cssRule.rule)));
    var selector = this.transformSelector(cssRule.selector);
    this.rules.push({
      selector,
      rule
    });
  }

  pixelifyProperties(cssRule) {
    forEach(cssRule, (value, key) => {
      if (typeof value === 'number' && value !== 0 && !UNITLESS[key]) {
        // @ts-expect-error Any ideas?
        cssRule[key] = "".concat(value, "px");
      }
    });
    return cssRule;
  }

  transformVars(_ref2) {
    var {
      vars
    } = _ref2,
        rest = _objectWithoutProperties(_ref2, _excluded);

    if (!vars) {
      return rest;
    }

    return _objectSpread2(_objectSpread2({}, mapKeys(vars, (_value, key) => _private.getVarName(key))), rest);
  }

  transformContent(_ref3) {
    var {
      content
    } = _ref3,
        rest = _objectWithoutProperties(_ref3, _excluded2);

    if (typeof content === 'undefined') {
      return rest;
    } // Handle fallback arrays:


    var contentArray = Array.isArray(content) ? content : [content];
    return _objectSpread2({
      content: contentArray.map(value => // This logic was adapted from Stitches :)
      value && (value.includes('"') || value.includes("'") || /^([A-Za-z\-]+\([^]*|[^]*-quote|inherit|initial|none|normal|revert|unset)(\s|$)/.test(value)) ? value : "\"".concat(value, "\""))
    }, rest);
  }

  transformSelector(selector) {
    // Map class list compositions to single identifiers
    var transformedSelector = selector;

    var _loop = function _loop(identifier, regex) {
      transformedSelector = transformedSelector.replace(regex, () => {
        adapter_dist_vanillaExtractCssAdapter.markCompositionUsed(identifier);
        return identifier;
      });
    };

    for (var {
      identifier,
      regex
    } of this.composedClassLists) {
      _loop(identifier, regex);
    } // Make sprinkles more specific than other classes


    if (transformedSelector.startsWith('sprinkles_') || transformedSelector.startsWith('_')) {
      transformedSelector = "".concat(transformedSelector, ".").concat(cssesc__default["default"](transformedSelector, {
        isIdentifier: true
      }));
    }

    return this.localClassNameRegex ? transformedSelector.replace(this.localClassNameRegex, (_, className, index) => {
      if (index > 0 && transformedSelector[index - 1] === '.') {
        return className;
      }

      return ".".concat(cssesc__default["default"](className, {
        isIdentifier: true
      }));
    }) : transformedSelector;
  }

  transformSelectors(root, rule, conditions) {
    forEach(rule.selectors, (selectorRule, selector) => {
      if (root.type !== 'local') {
        throw new Error("Selectors are not allowed within ".concat(root.type === 'global' ? '"globalStyle"' : '"selectors"'));
      }

      var transformedSelector = this.transformSelector(selector.replace(RegExp('&', 'g'), root.selector));
      validateSelector(transformedSelector, root.selector);
      var rule = {
        selector: transformedSelector,
        rule: omit(selectorRule, specialKeys)
      };

      if (conditions) {
        this.addConditionalRule(rule, conditions);
      } else {
        this.addRule(rule);
      }

      var selectorRoot = {
        type: 'selector',
        selector: transformedSelector,
        rule: selectorRule
      };
      this.transformSupports(selectorRoot, selectorRule['@supports'], conditions);
      this.transformMedia(selectorRoot, selectorRule['@media'], conditions);
    });
  }

  transformMedia(root, rules) {
    var parentConditions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    if (rules) {
      var _this$currConditional;

      (_this$currConditional = this.currConditionalRuleset) === null || _this$currConditional === void 0 ? void 0 : _this$currConditional.addConditionPrecedence(parentConditions, Object.keys(rules).map(query => "@media ".concat(query)));
      forEach(rules, (mediaRule, query) => {
        validateMediaQuery(query);
        var conditions = [...parentConditions, "@media ".concat(query)];
        this.addConditionalRule({
          selector: root.selector,
          rule: omit(mediaRule, specialKeys)
        }, conditions);

        if (root.type === 'local') {
          this.transformSimplePseudos(root, mediaRule, conditions);
          this.transformSelectors(root, mediaRule, conditions);
        }

        this.transformSupports(root, mediaRule['@supports'], conditions);
      });
    }
  }

  transformSupports(root, rules) {
    var parentConditions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    if (rules) {
      var _this$currConditional2;

      (_this$currConditional2 = this.currConditionalRuleset) === null || _this$currConditional2 === void 0 ? void 0 : _this$currConditional2.addConditionPrecedence(parentConditions, Object.keys(rules).map(query => "@supports ".concat(query)));
      forEach(rules, (supportsRule, query) => {
        var conditions = [...parentConditions, "@supports ".concat(query)];
        this.addConditionalRule({
          selector: root.selector,
          rule: omit(supportsRule, specialKeys)
        }, conditions);

        if (root.type === 'local') {
          this.transformSimplePseudos(root, supportsRule, conditions);
          this.transformSelectors(root, supportsRule, conditions);
        }

        this.transformMedia(root, supportsRule['@media'], conditions);
      });
    }
  }

  transformSimplePseudos(root, rule, conditions) {
    for (var key of Object.keys(rule)) {
      // Process simple pseudos
      if (simplePseudoLookup[key]) {
        if (root.type !== 'local') {
          throw new Error("Simple pseudos are not valid in ".concat(root.type === 'global' ? '"globalStyle"' : '"selectors"'));
        }

        if (conditions) {
          this.addConditionalRule({
            selector: "".concat(root.selector).concat(key),
            rule: rule[key]
          }, conditions);
        } else {
          this.addRule({
            conditions,
            selector: "".concat(root.selector).concat(key),
            rule: rule[key]
          });
        }
      }
    }
  }

  toCss() {
    var css = []; // Render font-face rules

    for (var fontFaceRule of this.fontFaceRules) {
      css.push(renderCss({
        '@font-face': fontFaceRule
      }));
    } // Render keyframes


    for (var keyframe of this.keyframesRules) {
      css.push(renderCss({
        ["@keyframes ".concat(keyframe.name)]: keyframe.rule
      }));
    } // Render unconditional rules


    for (var rule of this.rules) {
      css.push(renderCss({
        [rule.selector]: rule.rule
      }));
    } // Render conditional rules


    for (var conditionalRuleset of this.conditionalRulesets) {
      for (var conditionalRule of conditionalRuleset.renderToArray()) {
        css.push(renderCss(conditionalRule));
      }
    }

    return css.filter(Boolean);
  }

}

function renderCss(v) {
  var indent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var rules = [];

  var _loop2 = function _loop2(key) {
    var value = v[key];

    if (value && Array.isArray(value)) {
      rules.push(...value.map(v => renderCss({
        [key]: v
      }, indent)));
    } else if (value && typeof value === 'object') {
      var isEmpty = Object.keys(value).length === 0;

      if (!isEmpty) {
        rules.push("".concat(indent).concat(key, " {\n").concat(renderCss(value, indent + DOUBLE_SPACE), "\n").concat(indent, "}"));
      }
    } else {
      rules.push("".concat(indent).concat(key.startsWith('--') ? key : dashify(key), ": ").concat(value, ";"));
    }
  };

  for (var key of Object.keys(v)) {
    _loop2(key);
  }

  return rules.join('\n');
}

function transformCss(_ref4) {
  var {
    localClassNames,
    cssObjs,
    composedClassLists
  } = _ref4;
  var stylesheet = new Stylesheet(localClassNames, composedClassLists);

  for (var root of cssObjs) {
    stylesheet.processCssObj(root);
  }

  return stylesheet.toCss();
}

exports._objectSpread2 = _objectSpread2;
exports.dudupeAndJoinClassList = dudupeAndJoinClassList;
exports.transformCss = transformCss;