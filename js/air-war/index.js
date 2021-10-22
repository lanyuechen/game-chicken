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

    this.board = this.initBoard(row, col);

    this.addChild(new Grid(row, col, this.gridWidth));

    this.planes = [];
    for (let i = 0; i < 2; i++) {
      const plane = new Plane({
        gridWidth: this.gridWidth,
        draggable: true,
        onDragStart: (plane) => this.handleDragStart(plane),
        onDragEnd: (plane) => this.handleDragEnd(plane),
      });
      plane.y = row * this.gridWidth + this.margin;
  
      this.planes.push(plane);
      this.addChild(plane);
    }
  };

  initBoard(row, col) {
    const board = new Array(row);
    for (let i = 0; i < row; i++) {
      board[i] = new Array(col).fill(0);
    }
    return board;
  }

  handleDragStart(plane) {
    this.setBoard(plane, false);
  }

  handleDragEnd(plane) {
    const { x, y, gridWidth } = plane;
    const gx = Math.round(x / gridWidth);
    const gy = Math.round(y / gridWidth);
    
    if (this.isCollision(plane)) {
      plane.x = plane.oldPosition.x;
      plane.y = plane.oldPosition.y;
    } else {
      plane.x = gx * gridWidth;
      plane.y = gy * gridWidth;
    }

    this.setBoard(plane, true);
  }

  setBoard(plane, s) {
    const gx = parseInt(plane.x / plane.gridWidth);
    const gy = parseInt(plane.y / plane.gridWidth);
    plane._matrix.forEach((m, i) => {
      m.forEach((k ,j) => {
        if (k > 0 && this.board[gy + i] && typeof this.board[gy + i][gx + j] !== undefined) {
          this.board[gy + i][gx + j] = s ? k : 0;
        }
      });
    });
  }

  isCollision(plane) {
    const row = plane._matrix.length;
    const col = plane._matrix[0].length;
    const gx = parseInt(plane.x / plane.gridWidth);
    const gy = parseInt(plane.y / plane.gridWidth);

    if (gx < 0 || gx + col > this.col || gy < 0 || gy + row > this.row) {
      return true;
    }

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        if (plane._matrix[i][j] > 0 && this.board[gy + i][gx + j] > 0) {
          return true;
        }
      }
    }
    return false;
  }
}