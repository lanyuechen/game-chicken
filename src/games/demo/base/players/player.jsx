import React, { useState, useMemo, useEffect } from 'react';
import { AnimatedSprite } from '@inlet/react-pixi';
import MovableObject from '@/utils/movable-object';
import config from '@/config';
import { useRenderUpdate, usePreditUpdate } from '@/utils/use-tick';
import gameServer from '@/core/game-server';
import { MSG } from '@/constant';
import { noop } from '@/utils/utils';
import databus from '@/core/databus';

export default (props) => {
  const { id, x, y, rotation, hp, onShoot = noop } = props;
  const [state, setState] = useState({ x, y, rotation });

  const player = useMemo(() => {
    const mo = new MovableObject({
      x,
      y,
      id,
      rotation,
      width: 45 * config.dpr,
      height: 45 * config.dpr,
      hp,
    });

    databus.players.push(mo);

    return mo;
  }, []);

  useEffect(() => {
    const handleActionList = (obj) => {
      if (player.id !== obj.n) {
        return;
      }
      switch (obj.e) {
        case MSG.SHOOT:
          onShoot(player);
          break;
        case MSG.MOVE_DIRECTION:
          player.setDestRotation(obj.r);
          break;
        case MSG.MOVE_STOP:
          player.stop();
          break;
      }
    };
    
    gameServer.event.on('actionList', handleActionList);

    return () => {
      gameServer.event.off('onActionList', handleActionList);
      databus.players = databus.players.filter(d => d !== player);
    }
  }, []);

  useRenderUpdate((dt) => {
    if (player.renderUpdate(dt)) {
      setState({x: player.x, y: player.y, rotation: player.rotation});
    }
  }, []);

  usePreditUpdate((dt) => {
    player.preditUpdate(dt, true);
  }, []);

  console.log('[player]', player.id, state.x);

  return (
    <AnimatedSprite
      images={['images/aircraft1.png', 'images/aircraft2.png']}
      animationSpeed={0.17}
      anchor={0.5}
      x={state.x}
      y={state.y}
      width={player.width}
      height={player.height}
      rotation={state.rotation}
      isPlaying
    />
  );
};
