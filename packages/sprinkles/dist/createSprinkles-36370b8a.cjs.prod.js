'use strict';

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

var createSprinkles = composeStyles => function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var sprinklesStyles = Object.assign({}, ...args.map(a => a.styles));
  var sprinklesKeys = Object.keys(sprinklesStyles);
  var shorthandNames = sprinklesKeys.filter(property => typeof sprinklesStyles[property] === 'object' && 'mappings' in sprinklesStyles[property]);

  var sprinklesFn = props => {
    var classNames = [];
    var shorthands = {};

    var nonShorthands = _objectSpread2({}, props);

    var hasShorthands = false;

    for (var shorthand of shorthandNames) {
      var value = props[shorthand];

      if (value != null) {
        var sprinkle = sprinklesStyles[shorthand];
        hasShorthands = true;

        if (sprinkle !== null && sprinkle !== void 0 && sprinkle.mappings) {
          for (var propMapping of sprinkle === null || sprinkle === void 0 ? void 0 : sprinkle.mappings) {
            shorthands[propMapping] = value;

            if (nonShorthands[propMapping] == null) {
              delete nonShorthands[propMapping];
            }
          }
        }
      }
    }

    var finalProps = hasShorthands ? _objectSpread2(_objectSpread2({}, shorthands), nonShorthands) : props;

    var _loop = function _loop(prop) {
      var propValue = finalProps[prop];
      var sprinkle = sprinklesStyles[prop];

      try {
        if (sprinkle !== null && sprinkle !== void 0 && sprinkle.mappings) {
          // Skip shorthands
          return "continue";
        }

        if (typeof propValue === 'string' || typeof propValue === 'number') {
          var _args$find, _args$find$conditions;

          var defaultCondition = (_args$find = args.find(_ref => {
            var {
              styles
            } = _ref;
            return Object.keys(styles).find(k => k === prop);
          })) === null || _args$find === void 0 ? void 0 : (_args$find$conditions = _args$find.conditions) === null || _args$find$conditions === void 0 ? void 0 : _args$find$conditions.defaultCondition;

          if (defaultCondition) {
            classNames.push([prop, propValue, defaultCondition].join('_'));
          } else if (sprinkle !== 1) {
            classNames.push(sprinkle.values[propValue].defaultClass);
          }
        } else if (Array.isArray(propValue)) {
          for (var responsiveIndex in propValue) {
            var responsiveValue = propValue[responsiveIndex];

            if (responsiveValue != null && sprinkle) {
              var conditionName = sprinkle.responsiveArray[responsiveIndex];
              classNames.push([prop, responsiveValue, conditionName].join('_'));
            }
          }
        } else {
          for (var _conditionName in propValue) {
            // Conditional style
            var _value = propValue[_conditionName];

            if (_value != null) {
              classNames.push([prop, _value, _conditionName].join('_'));
            }
          }
        }
      } catch (e) {

        throw e;
      }
    };

    for (var prop in finalProps) {
      var _ret = _loop(prop);

      if (_ret === "continue") continue;
    }

    return composeStyles(classNames.join(' '));
  };

  return Object.assign(sprinklesFn, {
    properties: new Set(sprinklesKeys)
  });
};

exports.createSprinkles = createSprinkles;
