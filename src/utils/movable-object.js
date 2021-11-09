import config from '@/config.js';
import { velocityDecomposition, getDistance, getNumInRange, uuid } from '@/utils/utils';

export default class MovableObject {
  constructor({ id, x, y, width, height, rotation, speed }) {
    this.id = id || uuid();

    this.x = x || 0;
    this.y = y || 0;
    this.frameX = x;
    this.frameY = y;
    this.preditX = x;
    this.preditY = y;

    this.width = width;
    this.height = height;

    this.speed = speed;
    this.speedX = 0;
    this.speedY = 0;

    this.setDirection(rotation);

    this.radius = Math.sqrt((this.width / 2) ** 2 + (this.height / 2) ** 2);
  }

  get collisionCircle() {
    return {
      center: { x: this.frameX, y: this.frameY },
      radius: this.radius,
    };
  }

  clone() {
    return new MovableObject(this);
  }

  setDirection(rotation) {
    this.rotation = rotation;

    const { x, y } = velocityDecomposition(this.speed, this.rotation);

    this.speedX = x;
    this.speedY = -y;
  }

  checkNotInScreen() {
    return !!(
      this.frameX + this.radius < 0 ||
      this.frameX - this.radius > config.GAME_WIDTH ||
      this.frameY + this.radius < 0 ||
      this.frameY - this.radius > config.GAME_HEIGHT
    );
  }

  renderUpdate(dt) {
    if (this.x !== this.preditX || this.y !== this.preditY) {
      let dis = getDistance({ x: this.x, y: this.y }, { x: this.preditX, y: this.preditY });
      let temp = (dt / (1000 / 30)) * (this.speed * (1000 / 30));
      let percent = getNumInRange(temp / dis, 0, 1);

      this.x += (this.preditX - this.x) * percent;
      this.y += (this.preditY - this.y) * percent;
    }
  }

  frameUpdate(dt) {
    this.frameX += this.speedX * dt;
    this.frameY += this.speedY * dt;
  }

  preditUpdate(dt) {
    this.preditX += this.speedX * dt;
    this.preditY += this.speedY * dt;
  }
}
