import React, { forwardRef, useImperativeHandle } from 'react';
import { Sprite } from '@inlet/react-pixi';

import useStore from '@/utils/use-store';
import config from '@/config';
import databus from '@/core/databus';
import { velocityDecomposition, getDistance, getNumInRange } from '@/utils/utils';

const BULLET_WIDTH = 10 * config.dpr;
const BULLET_HEIGHT = 5 * config.dpr;

export default forwardRef((props, ref) => {
  const { x, y } = props;
  const store = useStore({
    radius: Math.sqrt((BULLET_WIDTH / 2) ** 2 + (BULLET_HEIGHT / 2) ** 2)
  });

  useImperativeHandle(ref, () => ({
    collisionCircle: () => {
      return {
        center: { x: store.frameX, y: store.frameY },
        radius: store.radius,
      }
    },
    setDirection: (radian) => {
      store.rotation = radian;
      let res = velocityDecomposition(store.speed, store.rotation);
  
      store.speedX = res.x;
      store.speedY = -res.y;
    },
    renderUpdate: (dt) => {
      if (this.x !== this.preditX || this.y !== this.preditY) {
        let dis = getDistance({ x: this.x, y: this.y }, { x: this.preditX, y: this.preditY });
        let temp = (dt / (1000 / 30)) * (this.speed * (1000 / 30));
        let percent = getNumInRange(temp / dis, 0, 1);
  
        this.x += (this.preditX - this.x) * percent;
        this.y += (this.preditY - this.y) * percent;
      }
    },
    frameUpdate: (dt) => {
      this.frameX += this.speedX * dt;
      this.frameY += this.speedY * dt;
  
      // 真正的删除操作交给逻辑帧来实现，避免逻辑帧想修复的时候子弹已经消失了
      if (this.checkNotInScreen(this.frameX, this.frameY)) {
        databus.removeBullets(this);
      }
    },
    preditUpdate: (dt) => {
      this.preditX += this.speedX * dt;
      this.preditY += this.speedY * dt;
    }
  }), []);

  return (
    <Sprite
      image="images/bullet_blue.png"
      x={x}
      y={y}
      width={BULLET_WIDTH}
      height={BULLET_HEIGHT}
      anchor={0.5}
    />
  );
});

class Bullet extends PIXI.Sprite {

  reset(options = {}) {
    this.speedX = 0;
    this.speedY = 0;
    this.speed = 0;
    this.rotation = 0;

    ({
      speed: this.speed,
      direction: this.direction,
      x: this.x,
      y: this.y,
      x: this.frameX,
      y: this.frameY,
      x: this.preditX,
      y: this.preditY,
    } = options);

    this.setDirection(this.direction);
  }

  checkNotInScreen(x, y) {
    return !!(
      x + this.radius < 0 ||
      x - this.radius > config.GAME_WIDTH ||
      y + this.radius < 0 ||
      y - this.radius > config.GAME_HEIGHT
    );
  }
}
