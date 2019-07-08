"use strict";

var Readable = require('stream').Readable;

var getOptions = require('./lib/util').getOptions;

var QR = require('./lib/qr-base').QR;
var png = require('./lib/png');
var vector = require('./lib/vector');

function qr_image(text, options) {
    options = getOptions(options);

    var matrix = QR(text, options.ec_level, options.parse_url);
    var stream = new Readable();
    stream._read = function() {};

    switch (options.type) {
    case 'svg':
    case 'pdf':
    case 'eps':
        process.nextTick(function() {
            vector[options.type](matrix, stream, options.margin, options.size);
        });
        break;
    case 'svgpath':
        // deprecated, use svg_object method
        process.nextTick(function() {
            var obj = vector.svg_object(matrix, options.margin, options.size);
            stream.push(obj.path);
            stream.push(null);
        });
        break;
    case 'png':
    default:
        process.nextTick(function() {
            var bitmap = png.bitmap(matrix, options.size, options.margin);
            if (options.customize) {
                options.customize(bitmap);
            }
            png.png(bitmap, stream);
        });
    }

    return stream;
}

module.exports = {
    image: qr_image,
};
