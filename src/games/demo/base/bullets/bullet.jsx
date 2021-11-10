import React from 'react';
import { Sprite } from '@inlet/react-pixi';

import config from '@/config';
import { useRenderUpdate, useLogicUpdate, usePreditUpdate } from '@/utils/use-tick';
import { useGlobalState } from '@/utils/state';

const BULLET_WIDTH = 10 * config.dpr;
const BULLET_HEIGHT = 5 * config.dpr;

export default (props) => {
  const { x, y, rotation } = props;
  const [state, updateState] = useGlobalState();

  useRenderUpdate((dt) => {
    updateState('bullets', {
      $set: state.bullets.map(bullet => {
        bullet.renderUpdate(dt);
        return bullet;
      })
    });
  }, [state]);

  return (
    <Sprite
      image="images/bullet_blue.png"
      x={x}
      y={y}
      width={BULLET_WIDTH}
      height={BULLET_HEIGHT}
      rotation={rotation}
      anchor={0.5}
    />
  );
};
