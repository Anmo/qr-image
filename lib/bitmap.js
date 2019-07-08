"use strict";

function bitmap(matrix, size, margin) {
  var N = matrix.length;
  var X = (N + 2 * margin) * size;
  var data = Buffer((X + 1) * X);
  data.fill(255);
  for (var i = 0; i < X; i++) {
      data[i * (X + 1)] = 0;
  }

  for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
          if (matrix[i][j]) {
              var offset = ((margin + i) * (X + 1) + (margin + j)) * size + 1;
              data.fill(0, offset, offset + size);
              for (var c = 1; c < size; c++) {
                  data.copy(data, offset + c * (X + 1), offset, offset + size);
              }
          }
      }
  }

  return {
      data: data,
      size: X
  }
}

module.exports = {
  bitmap: bitmap
};
