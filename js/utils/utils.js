
export function generateMatrix(row, col) {
  const res = new Array(row);
  for (let i = 0; i < row; i++) {
    res[i] = new Array(col).fill(0);
  }
  return res;
}

export function rotateMatrix(matrix) {
  const row = matrix.length;
  const col = matrix[0].length;

  const res = generateMatrix(col, row);

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      res[j][row - i - 1] = matrix[i][j];
    }
  }

  return res;
}