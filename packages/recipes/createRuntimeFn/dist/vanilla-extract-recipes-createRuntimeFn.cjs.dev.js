'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

var getApplicableCompounds = (compoundClassNames, compoundCheck, selections) => {
  var responsiveSize;

  for (var key of Object.keys(compoundCheck)) {
    if (Array.isArray(selections[key])) {
      var responsiveIndex = selections[key].indexOf(compoundCheck[key]);

      if (responsiveIndex === -1) {
        return false;
      }

      if (!responsiveSize) {
        var _compoundClassNames$r;

        responsiveSize = compoundClassNames === null || compoundClassNames === void 0 ? void 0 : (_compoundClassNames$r = compoundClassNames.responsiveArray) === null || _compoundClassNames$r === void 0 ? void 0 : _compoundClassNames$r[responsiveIndex];
      }
    } else if (typeof selections[key] === 'object') {
      if (!Object.values(selections[key]).includes(compoundCheck[key])) {
        return false;
      }
    } else if (compoundCheck[key] !== selections[key]) {
      return false;
    }
  }

  if (responsiveSize) {
    if (process.env.NODE_ENV !== 'production') {
      var _compoundClassNames$c;

      if (!(compoundClassNames !== null && compoundClassNames !== void 0 && (_compoundClassNames$c = compoundClassNames.conditions) !== null && _compoundClassNames$c !== void 0 && _compoundClassNames$c[responsiveSize])) {
        throw new Error();
      }
    }

    return compoundClassNames.conditions[responsiveSize];
  }

  return (compoundClassNames === null || compoundClassNames === void 0 ? void 0 : compoundClassNames.defaultClass) || compoundClassNames;
};

var createRuntimeFn = config => options => {
  var className = config.defaultClassName;

  var selections = _objectSpread2(_objectSpread2({}, config.defaultVariants), options);

  for (var variantName in selections) {
    var _selections$variantNa;

    var variantSelection = (_selections$variantNa = selections[variantName]) !== null && _selections$variantNa !== void 0 ? _selections$variantNa : config.defaultVariants[variantName];

    if (variantSelection != null) {
      var _config$variantClassN, _config$variantClassN2;

      var selection = variantSelection;

      if (typeof selection === 'boolean') {
        selection = selection === true ? 'true' : 'false';
      } else if (Array.isArray(selection)) {
        for (var responsiveIndex in selection) {
          var responsiveValue = selection[responsiveIndex];

          if (responsiveValue != null) {
            var sprinkle = config.variantClassNames[variantName][responsiveValue];
            var conditionName = sprinkle.responsiveArray[responsiveIndex];

            if (process.env.NODE_ENV !== 'production') {
              if (!sprinkle.conditions[conditionName]) {
                throw new Error();
              }
            }

            className += ' ' + sprinkle.conditions[conditionName];
          }
        }
      } else if (typeof selection === 'object') {
        for (var _conditionName in selection) {
          // Conditional style
          var value = selection[_conditionName];

          if (value != null) {
            var _sprinkle = config.variantClassNames[variantName][value];

            if (process.env.NODE_ENV !== 'production') {
              if (!_sprinkle.conditions[_conditionName]) {
                throw new Error();
              }
            }

            className += ' ' + _sprinkle.conditions[_conditionName];
          }
        }
      }

      className += ' ' + ( // @ts-expect-error
      (_config$variantClassN = (_config$variantClassN2 = config.variantClassNames[variantName][selection]) === null || _config$variantClassN2 === void 0 ? void 0 : _config$variantClassN2.defaultClass) !== null && _config$variantClassN !== void 0 ? _config$variantClassN : config.variantClassNames[variantName][selection]);
    }
  }

  for (var [compoundCheck, compoundClassNames] of config.compoundVariants) {
    var compoundClassName = getApplicableCompounds(compoundClassNames, compoundCheck, selections);

    if (compoundClassName) {
      className += ' ' + compoundClassName;
    }
  }

  return className;
};

exports.createRuntimeFn = createRuntimeFn;
