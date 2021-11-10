import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { AnimatedSprite } from '@inlet/react-pixi';

import config from '@/config';
import useStore from '@/utils/use-store';
import { useRenderUpdate, useLogicUpdate, usePreditUpdate } from '@/utils/use-tick';

import {
  velocityDecomposition,
  convertDegree2Radian,
  getDistance,
  getNumInRange,
  limitNumInRange,
  getMove,
} from '@/utils/utils';
import MovableObject from '@/utils/movable-object';
import { useUpdate } from '@/utils/databus';

import music from '@/base/music';

export default forwardRef((props, ref) => {
  const { userInfo, x, y, rotation: _rotation } = props;
  const playerRef = useRef();
  const update = useUpdate();

  const [position, setPosition] = useState({ x, y });
  const [rotation, setRotation] = useState(_rotation);
  
  const store = useStore({
    radius: parseInt(45 * config.dpr / 2),
    speed: 0,
    speedX: 0,
    speedY: 0,
    frameRotation: 0,
    frameX: x,
    frameY: y,
    preditX: x,
    preditY: y,
    desDegree: _rotation * 180 / Math.PI,
    frameDegree: _rotation * 180 / Math.PI,
    currDegree: _rotation * 180 / Math.PI,
    hp: config.playerHp,
  });

  useRenderUpdate((dt) => {
    const { x, y } = playerRef.current.position;
    if (x !== store.preditX || y !== store.preditY) {
      let dis = getDistance({ x, y }, { x: store.preditX, y: store.preditY });
      let temp = (dt / (1000 / 30)) * (0.2 * (1000 / 30));
      let percent = getNumInRange(temp / dis, 0, 1);

      setPosition({
        x: x + (store.preditX - x) * percent,
        y: y + (store.preditY - y) * percent,
      });
    }

    if (store.currDegree !== store.frameDegree) {
      const dis = getMove(store.currDegree, store.frameDegree);

      let temp = (dt / (1000 / 30)) * 10;
      let percent = getNumInRange(temp / Math.abs(dis), 0, 1);

      store.currDegree += dis * percent;

      store.currDegree = limitNumInRange(store.currDegree, 0, 360);
      setRotation(convertDegree2Radian(store.currDegree))
    }
  }, []);

  useLogicUpdate((dt) => {
    let newX = store.frameX + store.speedX * dt;
    let newY = store.frameY + store.speedY * dt;

    store.frameX = getNumInRange(newX, store.radius, config.GAME_WIDTH - store.radius);
    store.frameY = getNumInRange(newY, store.radius, config.GAME_HEIGHT - store.radius);

    // 当前方向与目标方向不一致，朝着目标方向推进
    if (store.frameDegree !== store.desDegree) {
      const dis = getMove(store.frameDegree, store.desDegree);

      if (Math.abs(dis) <= 10) {
        store.frameDegree = store.desDegree;
      } else {
        if (dis > 0) {
          store.frameDegree += 10;
        } else {
          store.frameDegree -= 10;
        }
      }

      store.frameDegree = limitNumInRange(store.frameDegree, 0, 360);

      let radian = convertDegree2Radian(store.frameDegree);
      store.frameRotation = radian;
      setSpeed(0.2, radian);
    }
  }, []);

  usePreditUpdate((dt) => {
    let newX = store.frameX + store.speedX * dt;
    let newY = store.frameY + store.speedY * dt;

    store.preditX = getNumInRange(newX, store.radius, config.GAME_WIDTH - store.radius);
    store.preditY = getNumInRange(newY, store.radius, config.GAME_HEIGHT - store.radius);
  }, []);

  useImperativeHandle(ref, () => ({
    stop: () => {
      setSpeed(0);
      store.desDegree = store.frameDegree;
    },
    setDirection: (degree) => {
      store.desDegree = degree;
      store.frameDegree = degree;
      store.currDegree = degree;
      
      store.frameRotation = convertDegree2Radian(degree);
      setRotation(store.frameRotation);
    },
    collisionCircle: () => {
      return {
        center: { x: store.frameX, y: store.frameY },
        radius: store.radius,
      };
    },
    shoot: () => {
      const half = parseInt(45 * config.dpr / 2);
      const { x, y } = playerRef.current.position;
      const rotation = playerRef.current.rotation;

      const bullet = new MovableObject({
        x: x + half * Math.cos(rotation),
        y: y + half * Math.sin(rotation),
        width: 10 * config.dpr,
        height: 5 * config.dpr,
        rotation: store.frameRotation,
        speed: 0.7,
      });

      bullet.clientId = userInfo.clientId;

      update('bullets', {
        $push: [
          bullet
        ]
      });
  
      // music.playShoot();
    },
    setDestDegree: (degree) => {
      store.desDegree = degree;
    },
  }), []);

  const setSpeed = (speed, _rotation) => {
    store.speed = speed;
    _rotation = _rotation || rotation;

    const { x, y } = velocityDecomposition(store.speed, _rotation);
    store.speedX = x;
    store.speedY = -y;
  }

  return (
    <AnimatedSprite
      ref={playerRef}
      images={['images/aircraft1.png', 'images/aircraft2.png']}
      anchor={0.5}
      rotation={rotation}
      width={45 * config.dpr}
      height={45 * config.dpr}
      position={position}
      animationSpeed={parseFloat((20 / 120).toFixed(2))}
      isPlaying
    />
  );
});
