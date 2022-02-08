import { addRecipe } from '@vanilla-extract/css/recipe';
import { style } from '@vanilla-extract/css';
import { createRuntimeFn } from '../createRuntimeFn/dist/vanilla-extract-recipes-createRuntimeFn.esm.js';

function mapValues(input, fn) {
  var result = {};

  for (var _key in input) {
    result[_key] = fn(input[_key], _key);
  }

  return result;
}

function getStyleValues(options, styleRule, getId) {
  if ('conditions' in options) {
    var result = {
      conditions: {}
    };
    var defaultConditions = options.defaultCondition ? Array.isArray(options.defaultCondition) ? options.defaultCondition : [options.defaultCondition] : [];
    var defaultClasses = [];

    if ('responsiveArray' in options) {
      result.responsiveArray = options.responsiveArray;
    }

    for (var conditionName in options.conditions) {
      var styleValue = styleRule;
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

      var className = style(styleValue, "".concat(getId(), "_").concat(conditionName));
      result.conditions[conditionName] = className;

      if (defaultConditions.indexOf(conditionName) > -1) {
        defaultClasses.push(className);
      }
    }

    if (defaultClasses.length > 0) {
      result.defaultClass = defaultClasses.join(' ');
    }

    return result;
  } else {
    return style(styleRule, getId());
  }
}

function recipe(options, debugId) {
  var {
    variants = {},
    defaultVariants = {},
    compoundVariants = [],
    base = ''
  } = options;
  var defaultClassName = typeof base === 'string' ? base : style(base, debugId); // @ts-expect-error

  var variantClassNames = mapValues(variants, (variantGroup, variantGroupName) => {
    var styles = {};

    var _loop = function _loop(_key2) {
      var styleRule = variantGroup[_key2];
      styles[_key2] = getStyleValues(options, typeof styleRule === 'string' ? [styleRule] : styleRule, () => {
        var id = "".concat(variantGroupName, "_").concat(_key2);
        return debugId ? "".concat(debugId, "_").concat(id) : id;
      });
    };

    for (var _key2 in variantGroup) {
      _loop(_key2);
    }

    return styles;
  });
  var compounds = [];

  for (var {
    style: theStyle,
    variants: _variants
  } of compoundVariants) {
    compounds.push([_variants, getStyleValues(options, typeof theStyle === 'string' ? [theStyle] : theStyle, () => {
      var id = "compound_".concat(compounds.length);
      return debugId ? "".concat(debugId, "_").concat(id) : id;
    })]);
  }

  var config = {
    defaultClassName,
    variantClassNames,
    defaultVariants,
    compoundVariants: compounds
  };
  return addRecipe(createRuntimeFn(config), {
    importPath: '@vanilla-extract/recipes/createRuntimeFn',
    importName: 'createRuntimeFn',
    // @ts-expect-error
    args: [config]
  });
}

export { recipe };
