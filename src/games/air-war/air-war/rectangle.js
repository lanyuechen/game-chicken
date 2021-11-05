export default class Rectangle extends PIXI.Graphics {
  constructor(row, col, width = 50, color = 0x000000) {
    super();

    this.interactive = true;

    this.color = color;
    this.row = row;
    this.col = col;
    this._width = width;

    this.draw();

    this.on('pointerdown', () => this.draw(true));
    this.on('pointerup', () => this.draw());
    this.on('pointerupoutside', () => this.draw());
  }

  draw(active) {
    this.clear();
    this.lineStyle(1, this.color);
    this.beginFill(this.color, active ? 0.2 : 0.05);
    this.drawRect(this.col * this._width, this.row * this._width, this._width, this._width);
    this.endFill();
  }
}