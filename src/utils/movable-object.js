import config from '@/config.js';
import {
  uuid,
  getMove,
  getDistance,
  getNumInRange,
  limitNumInRange,
  velocityDecomposition,
} from '@/utils/utils';

export default class MovableObject {
  constructor({ id, x, y, width, height, rotation, speed, ...others }) {
    this.id = id || uuid();

    Object.assign(this, others);

    this.x = x || 0;
    this.y = y || 0;
    this.preditX = this.x;
    this.preditY = this.y;

    this.width = width;
    this.height = height;

    this.speed = speed || 0;
    this.speedX = 0;
    this.speedY = 0;

    this.rotation = rotation || 0;
    this.preditRotation = this.rotation;
    this.destRotation = this.rotation;

    this.setSpeed(this.speed, this.rotation);

    this.radius = Math.sqrt((this.width / 2) ** 2 + (this.height / 2) ** 2);
  }

  get collisionCircle() {
    return {
      center: { x: this.x, y: this.y },
      radius: this.radius,
    };
  }

  clone() {
    return new MovableObject(this);
  }

  setSpeed(speed, rotation) {
    this.speed = speed;
    this.rotation = rotation || this.rotation;

    const { x, y } = velocityDecomposition(this.speed, this.rotation);

    this.speedX = x;
    this.speedY = -y;
  }

  setDestRotation(radian) {
    this.destRotation = radian;
  }

  checkNotInScreen() {
    return !!(
      this.preditX + this.radius < 0 ||
      this.preditX - this.radius > config.GAME_WIDTH ||
      this.preditY + this.radius < 0 ||
      this.preditY - this.radius > config.GAME_HEIGHT
    );
  }

  renderUpdate(dt) {
    let isUpdate = false;
    if (this.speed && (this.x !== this.preditX || this.y !== this.preditY)) {
      let dis = getDistance({ x: this.x, y: this.y }, { x: this.preditX, y: this.preditY });
      let temp = (dt / (1000 / 30)) * (this.speed * (1000 / 30));
      let percent = getNumInRange(temp / dis, 0, 1);

      this.x += (this.preditX - this.x) * percent;
      this.y += (this.preditY - this.y) * percent;
      isUpdate = true;
    }

    if (this.rotation !== this.preditRotation) {
      const dis = getMove(this.rotation, this.preditRotation);

      let temp = (dt / (1000 / 30)) * 10;
      let percent = getNumInRange(temp / Math.abs(dis), 0, 1);

      this.rotation += dis * percent;

      this.rotation = limitNumInRange(this.rotation, 0, 2 * Math.PI);
      isUpdate = true;
    }

    return isUpdate;
  }

  preditUpdate(dt, notOutOfScreen) {
    this.preditX += this.speedX * dt;
    this.preditY += this.speedY * dt;
    if (notOutOfScreen) {
      this.preditX = getNumInRange(this.preditX, this.radius, config.GAME_WIDTH - this.radius);
      this.preditY = getNumInRange(this.preditY, this.radius, config.GAME_HEIGHT - this.radius);
    }

    if (this.preditRotation !== this.destRotation) {
      const dis = getMove(this.preditRotation, this.destRotation);

      if (Math.abs(dis) <= 10 * Math.PI / 180) {
        this.preditRotation = this.destRotation;
      } else {
        this.preditRotation += Math.sign(dis) * 10 * Math.PI / 180;
      }

      this.preditRotation = limitNumInRange(this.preditRotation, 0, 2 * Math.PI);

      this.setSpeed(0.2, this.preditRotation);
    }
  }
}
