export default class Rectangle extends PIXI.Graphics {
  constructor(row, col, width = 50) {
    super();

    this.interactive = true;

    this.color = 0x000000;
    this.row = row;
    this.col = col;
    this._width = width;

    this.draw();

    this.on('pointerover', () => {
      console.log('===========')
      draw(true);
    });
    this.on('pointerout', () => {
      draw();
    });
  }

  draw(active) {
    this.clear();
    this.lineStyle(1);
    this.beginFill(this.color, active ? 0.1 : 0.01);
    this.drawRect(this.row * this._width, this.col * this._width, this._width, this._width);
    this.endFill();
  }
}
