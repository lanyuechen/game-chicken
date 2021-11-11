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
    this.frameX = x;
    this.frameY = y;
    this.preditX = x;
    this.preditY = y;

    this.width = width;
    this.height = height;

    this.speed = speed;
    this.speedX = 0;
    this.speedY = 0;

    this.currDegree = 0;
    this.frameDegree = 0;
    this.desDegree = 0;
    this.frameRotation = 0;

    this.setSpeed(speed, rotation);

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

  setSpeed(speed, rotation) {
    this.speed = speed;
    this.rotation = rotation;

    const { x, y } = velocityDecomposition(this.speed, this.rotation);

    this.speedX = x;
    this.speedY = -y;
  }

  setDestDegree(degree) {
    this.desDegree = degree * Math.PI / 180;
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

    if (this.currDegree !== this.frameDegree) {
      const dis = getMove(this.currDegree, this.frameDegree);

      let temp = (dt / (1000 / 30)) * 10;
      let percent = getNumInRange(temp / Math.abs(dis), 0, 1);

      this.currDegree += dis * percent;

      this.currDegree = limitNumInRange(this.currDegree, 0, 2 * Math.PI);
      this.rotation = this.currDegree;
    }

    return this;
  }

  frameUpdate(dt, notOutOfScreen) {
    this.frameX += this.speedX * dt;
    this.frameY += this.speedY * dt;
    if (notOutOfScreen) {
      this.frameX = getNumInRange(this.frameX, this.radius, config.GAME_WIDTH - this.radius);
      this.frameY = getNumInRange(this.frameY, this.radius, config.GAME_HEIGHT - this.radius);
    }

    if (this.frameDegree !== this.desDegree) {
      const dis = getMove(this.frameDegree, this.desDegree);

      if (Math.abs(dis) <= 10 * Math.PI / 180) {
        this.frameDegree = this.desDegree;
      } else {
        this.frameDegree += Math.sign(dis) * 10 * Math.PI / 180;
      }

      this.frameDegree = limitNumInRange(this.frameDegree, 0, 2 * Math.PI);

      this.frameRotation = this.frameDegree;

      this.setSpeed(0.2, this.frameDegree);
    }
    return this;
  }

  preditUpdate(dt, notOutOfScreen) {
    this.preditX += this.speedX * dt;
    this.preditY += this.speedY * dt;
    if (notOutOfScreen) {
      this.preditX = getNumInRange(this.preditX, this.radius, config.GAME_WIDTH - this.radius);
      this.preditY = getNumInRange(this.preditY, this.radius, config.GAME_HEIGHT - this.radius);
    }
    return this;
  }
}
