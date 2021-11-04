import Rectangle from "./rectangle";

export default class Grid extends PIXI.Container {
  constructor(row, col, width) {
    super();

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        const g = new Rectangle(i, j, width, 0xdddddd);

        this.addChild(g);
      }
    }
  }
}