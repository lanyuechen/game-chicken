import Grid from './grid';

export default class DeployScene extends PIXI.Container {
  constructor(options = {}) {
    super();
    const { row, col, gridWidth, board } = options;

    this.row = row;
    this.col = col;
    this.gridWidth = gridWidth;
    this.board = board;

    this.addChild(new Grid(row, col, gridWidth));
  };
}