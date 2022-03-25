'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var createSprinkles$1 = require('../../dist/createSprinkles-36370b8a.cjs.prod.js');

var composeStyles = classList => classList;

var createSprinkles = function createSprinkles() {
  return createSprinkles$1.createSprinkles(composeStyles)(...arguments);
};
/** @deprecated - Use `createSprinkles` */

var createAtomsFn = createSprinkles;

exports.createAtomsFn = createAtomsFn;
exports.createSprinkles = createSprinkles;
