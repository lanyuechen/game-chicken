import Rectangle from "./rectangle";

const randomColor = () => {
  return Math.floor(Math.random() * 2 ** 24)
}

export default class Plane extends PIXI.Container {
  constructor(options = {}) {
    super();

    const { gridWidth = 20, draggable, onDragStart, onDrag, onDragEnd } = options;

    this.interactive = true;
    this.buttonMode = true;

    this.gridWidth = gridWidth;
    this.draggable = draggable;
    this.onDragStart = onDragStart;
    this.onDrag = onDrag;
    this.onDragEnd = onDragEnd;

    this._matrix = [
      [0, 0, 2, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
    ];

    if (draggable) {
      this.on('pointerdown', this.handleDragStart);
      this.on('pointerup', this.handleDragEnd);
      this.on('pointerupoutside', this.handleDragEnd);
    }

    this.draw();
  }

  handleDragStart(event) {
    this.data = event.data;
    this.offset = event.data.getLocalPosition(this);
    this.oldPosition = { x: this.x, y: this.y };
    this.alpha = 0.5;
    this.dragging = true;
    this.onDragStart && this.onDragStart(this);
    this.on('pointermove', this.handleDragMove);
  }

  handleDragEnd() {
    if (this.dragging) {
      this.onDragEnd && this.onDragEnd(this);
      this.alpha = 1;
      this.dragging = false;
      this.data = null;
      this.offset = null;
      this.oldPosition = null;
      this.off('pointermove', this.handleDragMove);
    }
  }

  handleDragMove() {
    if (this.dragging) {
      const { x, y } = this.data.getLocalPosition(this.parent);
      this.x = x - this.offset.x;
      this.y = y - this.offset.y;
      this.onDrag && this.onDrag(this);
    }
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