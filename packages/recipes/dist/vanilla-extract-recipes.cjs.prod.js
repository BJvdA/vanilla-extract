'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var recipe$1 = require('@vanilla-extract/css/recipe');
var css = require('@vanilla-extract/css');
var createRuntimeFn_dist_vanillaExtractRecipesCreateRuntimeFn = require('../createRuntimeFn/dist/vanilla-extract-recipes-createRuntimeFn.cjs.prod.js');

function mapValues(input, fn) {
  var result = {};

  for (var _key in input) {
    result[_key] = fn(input[_key], _key);
  }

  return result;
}

function recipe(options, debugId) {
  var {
    variants = {},
    defaultVariants = {},
    compoundVariants = [],
    base = ''
  } = options;
  var defaultClassName = typeof base === 'string' ? base : css.style(base, debugId); // @ts-expect-error

  var variantClassNames = mapValues(variants, (variantGroup, variantGroupName) => {
    var styles = {};

    for (var _key2 in variantGroup) {
      var styleRule = variantGroup[_key2];

      if ('conditions' in options) {
        styles[_key2] = {
          conditions: {}
        };
        var defaultConditions = options.defaultCondition ? Array.isArray(options.defaultCondition) ? options.defaultCondition : [options.defaultCondition] : [];
        var defaultClasses = [];

        if ('responsiveArray' in options) {
          styles[_key2].responsiveArray = options.responsiveArray;
        }

        for (var conditionName in options.conditions) {
          var styleValue = typeof styleRule === 'string' ? [styleRule] : styleRule;
          var condition = options.conditions[conditionName];

          if (condition['@supports']) {
            styleValue = {
              '@supports': {
                [condition['@supports']]: styleValue
              }
            };
          }

          if (condition['@media']) {
            styleValue = {
              '@media': {
                [condition['@media']]: styleValue
              }
            };
          }

          if (condition.selector) {
            styleValue = {
              selectors: {
                [condition.selector]: styleValue
              }
            };
          }

          var className = css.style(styleValue, "".concat(variantGroupName, "_").concat(_key2, "_").concat(conditionName));
          styles[_key2].conditions[conditionName] = className;

          if (defaultConditions.indexOf(conditionName) > -1) {
            defaultClasses.push(className);
          }
        }

        if (defaultClasses.length > 0) {
          styles[_key2].defaultClass = defaultClasses.join(' ');
        }
      } else {
        styles[_key2] = css.style(typeof styleRule === 'string' ? [styleRule] : styleRule, debugId ? "".concat(debugId, "_").concat(variantGroupName, "_").concat(_key2) : "".concat(variantGroupName, "_").concat(_key2));
      }
    }

    return styles;
  });
  var compounds = [];

  for (var {
    style: theStyle,
    variants: _variants
  } of compoundVariants) {
    compounds.push([_variants, typeof theStyle === 'string' ? theStyle : css.style(theStyle, "".concat(debugId, "_compound_").concat(compounds.length))]);
  }

  var config = {
    defaultClassName,
    variantClassNames,
    defaultVariants,
    compoundVariants: compounds
  };
  return recipe$1.addRecipe(createRuntimeFn_dist_vanillaExtractRecipesCreateRuntimeFn.createRuntimeFn(config), {
    importPath: '@vanilla-extract/recipes/createRuntimeFn',
    importName: 'createRuntimeFn',
    // @ts-expect-error
    args: [config]
  });
}

exports.recipe = recipe;
