"use strict";

var getOptions = require('./lib/util').getOptions;

var QR = require('./lib/qr-base').QR;
var vector = require('./lib/vector');

function svg_object(text, options) {
  options = getOptions(options, 'svg');

  var matrix = QR(text, options.ec_level);
  return vector.svg_object(matrix, options.margin);
}

module.exports = {
  svgObject: svg_object
};
