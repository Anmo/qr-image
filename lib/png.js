"use strict";

var crc32 = require('./crc32');

var PNG_HEAD = Buffer([137,80,78,71,13,10,26,10]);
var PNG_IHDR = Buffer([0,0,0,13,73,72,68,82,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0]);
var PNG_IEND = Buffer([0,0,0,0,73,69,78,68,174,66,96,130]);

function png(bitmap, stream) {
    var zlib = require('zlib');
    var IHDR = Buffer(25);
    PNG_IHDR.copy(IHDR);
    IHDR.writeUInt32BE(bitmap.size, 8);
    IHDR.writeUInt32BE(bitmap.size, 12);
    IHDR.writeUInt32BE(crc32(IHDR.slice(4, -4)), 21);

    stream.push(PNG_HEAD);
    stream.push(IHDR);

    var IDAT = [ Buffer([0,0,0,0,73,68,65,84]) ];

    zlib.createDeflate({ level: 9 }).on('data', function(chunk) {
        IDAT.push(chunk);
    }).on('end', function() {

        IDAT.push(Buffer(4));
        IDAT = Buffer.concat(IDAT);
        IDAT.writeUInt32BE(IDAT.length - 12, 0);
        IDAT.writeUInt32BE(crc32(IDAT.slice(4, -4)), IDAT.length - 4);
        stream.push(IDAT);

        stream.push(PNG_IEND);
        stream.push(null);
    }).end(bitmap.data);
}

module.exports = {
    png: png
}
