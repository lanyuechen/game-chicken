import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { AnimatedSprite } from '@inlet/react-pixi';

import config from '@/config';
import useStore from '@/utils/use-store';

import {
  velocityDecomposition,
  convertDegree2Radian,
  getDistance,
  getNumInRange,
  limitNumInRange,
  getMove,
} from '@/utils/utils';

import Bullet from '@/base/bullet';
import databus from '@/core/databus';
import music from '@/base/music';

export default forwardRef((props, ref) => {
  const { userInfo } = props;

  const [position, setPosition] = useState([config.GAME_WIDTH / 2, config.GAME_HEIGHT / 2]);
  const store = useStore({
    radius: parseInt(45 * config.dpr / 2),
    speed: 0,
    speedX: 0,
    speedY: 0,
    rotation: 0,
    frameRotation: 0,
    userData: userInfo,
    frameX: 0,
    frameY: 0,
    preditX: 0,
    preditY: 0,
    desDegree: 0,
    frameDegree: 0,
    currDegree: 0,
    hp: config.playerHp,
  });

  useImperativeHandle(ref, () => ({
    setDirection: (degree) => {
      store.desDegree = degree;
      store.frameDegree = degree;
      store.currDegree = degree;

      store.rotation = convertDegree2Radian(degree); // 
      
      store.frameRotation = store.rotation;
    },
    collisionCircle: () => {
      return {
        center: { x: store.frameX, y: store.frameY },
        radius: store.radius,
      };
    },
    setPos: (x, y) => {
      setPosition(p => [
        x !== undefined ? x : p.x,
        y !== undefined ? y : p.y,
      ]);
    },
    shoot: () => {
      // const bullet = new Bullet();
      // databus.bullets.push(bullet);
  
      // bullet.reset({
      //   //direction: this.rotation,
      //   direction: this.frameRotation,
      //   speed: 0.7,
      //   ...this.shootPoint(),
      // });
  
      // bullet.sourcePlayer = this;
  
      // this.parent.addChild(bullet);
  
      // music.playShoot();
    },
    setDestDegree: (degree) => {
      store.desDegree = degree;
    },
    /**
     * 为了表现平滑，渲染帧都会以一个比逻辑帧的速度执行
     * 逻辑帧也会计算该逻辑帧最终的表现数据
     */
    renderUpdate: (dt) => {
      // if (this.x !== this.preditX || this.y !== this.preditY) {
      //   let dis = getDistance({ x: this.x, y: this.y }, { x: this.preditX, y: this.preditY });
      //   let temp = (dt / (1000 / 30)) * (0.2 * (1000 / 30));
      //   let percent = getNumInRange(temp / dis, 0, 1);

      //   this.x += (this.preditX - this.x) * percent;
      //   this.y += (this.preditY - this.y) * percent;
      // }

      // if (this.currDegree !== this.frameDegree) {
      //   const dis = getMove(this.currDegree, this.frameDegree);

      //   let temp = (dt / (1000 / 30)) * 10;
      //   let percent = getNumInRange(temp / Math.abs(dis), 0, 1);

      //   this.currDegree += dis * percent;

      //   this.currDegree = limitNumInRange(this.currDegree, 0, 360);
      //   this.rotation = convertDegree2Radian(this.currDegree);
      // }
    },
    // 每个逻辑帧执行
    frameUpdate: (dt) => {
      // let newX = this.frameX + this.speedX * dt;
      // let newY = this.frameY + this.speedY * dt;

      // // 碰到边缘
      // if (newX - this.radius >= 0 && newX + this.radius <= config.GAME_WIDTH) {
      //   this.frameX = newX;
      // }

      // if (newY - this.radius >= 0 && newY + this.radius <= config.GAME_HEIGHT) {
      //   this.frameY = newY;
      // }

      // // 当前方向与目标方向不一致，朝着目标方向推进
      // if (this.frameDegree !== this.desDegree) {
      //   const dis = getMove(this.frameDegree, this.desDegree);

      //   if (Math.abs(dis) <= 10) {
      //     this.frameDegree = this.desDegree;
      //   } else {
      //     if (dis > 0) {
      //       this.frameDegree += 10;
      //     } else {
      //       this.frameDegree -= 10;
      //     }
      //   }

      //   this.frameDegree = limitNumInRange(this.frameDegree, 0, 360);

      //   let radian = convertDegree2Radian(this.frameDegree);
      //   this.frameRotation = radian;
      //   this.setSpeed(0.2, radian);
      // }
    },
    preditUpdate(dt) {
      // let newX = this.frameX + this.speedX * dt;
      // let newY = this.frameY + this.speedY * dt;
  
      // // 碰到边缘
      // if (newX - this.radius >= 0 && newX + this.radius <= config.GAME_WIDTH) {
      //   this.preditX = newX;
      // }
  
      // if (newY - this.radius >= 0 && newY + this.radius <= config.GAME_HEIGHT) {
      //   this.preditY = newY;
      // }
    }
  }));

  // 子弹发射点的位置
  const shootPoint = () => {
    // let half = parseInt(45 * config.dpr / 2);
    // return {
    //   x: x + half * Math.cos(store.rotation),
    //   y: y + half * Math.sin(store.rotation),
    // };
  }

  const setSpeed = (speed, rotation) => {
    store.speed = speed;
    rotation = rotation || store.rotation;

    const { x, y } = velocityDecomposition(store.speed, rotation);
    store.speedX = x;
    store.speedY = -y;
  }

  return (
    <AnimatedSprite
      images={['images/aircraft1.png', 'images/aircraft2.png']}
      anchor={0.5}
      rotation={0}
      width={45 * config.dpr}
      height={45 * config.dpr}
      position={position}
      animationSpeed={parseFloat((20 / 120).toFixed(2))}
      isPlaying
    >

    </AnimatedSprite>
  );
});
