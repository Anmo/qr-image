"use strict";

global.Buffer = global.Buffer || require('buffer').Buffer;

module.exports = {
    matrix: require('./lib/qr-base').QR,
    imageSync: require('./image-sync').imageSync,
    image: require('./image').image,
    svgObject: require('./svg').svgObject,
};