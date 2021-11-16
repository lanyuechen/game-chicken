import React, { useState, useMemo, useEffect } from 'react';
import { Sprite } from '@inlet/react-pixi';
import MovableObject from '@/utils/movable-object';
import { useRenderUpdate } from '@/utils/use-tick';
import config from '@/config';
import databus from '@/core/databus';

export default (props) => {
  const { id, x, y, rotation, clientId } = props;

  const [state, setState] = useState({ x, y, rotation });

  const bullet = useMemo(() => {
    const mo = new MovableObject({
      id,
      clientId,
      x,
      y,
      width: 10 * config.dpr,
      height: 5 * config.dpr,
      rotation,
      speed: 0.7,
    });

    databus.bullets.push(mo);

    return mo;
  }, []);

  useEffect(() => {
    return () => {
      databus.bullets = databus.bullets.filter(d => d !== bullet);
    }
  }, []);

  useRenderUpdate((dt) => {
    if (bullet.renderUpdate(dt)) {
      setState({ x: bullet.x, y: bullet.y, rotation: bullet.rotation });
    }
  });

  return (
    <Sprite
      image="images/bullet_blue.png"
      x={state.x}
      y={state.y}
      width={bullet.width}
      height={bullet.height}
      rotation={state.rotation}
      anchor={0.5}
    />
  );
};
