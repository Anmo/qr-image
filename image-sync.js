"use strict";

global.Buffer = global.Buffer || require('buffer').Buffer;

var getOptions = require('./lib/util').getOptions;

var QR = require('./lib/qr-base').QR;
var bitmap = require('./lib/bitmap').bitmap;
var png_sync = require('./lib/png_sync').png_sync;
var vector = require('./lib/vector');

function qr_image_sync(text, options) {
  options = getOptions(options);

  var matrix = QR(text, options.ec_level, options.parse_url);
  var result;

  switch (options.type) {
  case 'svg':
  case 'pdf':
  case 'eps':
      var stream = [];
      vector[options.type](matrix, stream, options.margin, options.size);
      result = stream.filter(Boolean).join('');
      break;
  case 'png':
  default:
      var bitmapData = bitmap(matrix, options.size, options.margin);
      if (options.customize) {
          options.customize(bitmapData);
      }
      result = png_sync(bitmapData);
  }

  return result;
}

module.exports = {
  imageSync: qr_image_sync
};
