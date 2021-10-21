import Rectangle from "./rectangle";

const randomColor = () => {
  return Math.floor(Math.random() * 2 ** 24)
}

export default class Plane extends PIXI.Container {
  constructor(gridX = 0, gridY = 0, gridWidth = 20) {
    super();

    this.gridWidth = gridWidth;
    this.gridX = gridX;
    this.gridY = gridY;
    this.x = gridX * gridWidth;
    this.y = gridY * gridWidth;

    this._matrix = [
      [0, 0, 2, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
    ];

    this.draw();
  }

  draw() {
    const color = randomColor();
    this._matrix.forEach((m, i) => {
      m.forEach((k, j) => {
        if (k > 0) {
          this.addChild(new Rectangle(i, j, this.gridWidth, color));
        }
      });
    });
  }
}