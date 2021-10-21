import Stage from './stage';
import Grid from './grid';
import Plane from './plane';

const defaultOptions = {
  row: 8,
  col: 10,
}

export default class AirWar extends Stage {
  constructor(options = defaultOptions) {
    super();
    const { row, col } = options;

    this.row = row;
    this.col = col;
    this.gridWidth = this.stageWidth / col;

    this.board = new Array(row);
    for (let i = 0; i < row; i++) {
      this.board[i] = new Array(col).fill(0);
    }

    const grid = new Grid(row, col, this.gridWidth);

    this.addChild(grid);
    this.addPlane(new Plane(0, 1, this.gridWidth));
    this.addPlane(new Plane(3, 0, this.gridWidth));

  };

  addPlane(plane) {
    if (this.isCollision(plane)) {
      return;
    }

    plane._matrix.forEach((m, i) => {
      m.forEach((k ,j) => {
        this.board[plane.gridY + i][plane.gridX + j] = k;
      });
    });

    this.addChild(plane);
  }

  isCollision(plane) {
    const m = plane._matrix;

    if (
      plane.gridX < 0 ||
      plane.gridX + m.length > this.col ||
      plane.gridY < 0 ||
      plane.gridY + m[0].length > this.row
    ) {
      return true;
    }

    for (let i = 0; i < m.length; i++) {
      for (let j = 0; j < m[i].length; j++) {
        if (m[i][j] > 0 && this.board[plane.gridY + i][plane.gridX + j] > 0) {
          return true;
        }
      }
    }
    return false;
  }
}