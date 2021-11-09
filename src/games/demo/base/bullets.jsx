import React from 'react';
import Bullet from '../base/bullet';

import databus from '@/core/databus';
import { useRenderUpdate, useLogicUpdate, usePreditUpdate } from '@/utils/use-tick';
import { useGlobalState } from '@/utils/state';

export default () => {
  const [state, updateState] = useGlobalState();

  useRenderUpdate((dt) => {
    updateState('bullets', {
      $set: state.bullets.map(bullet => {
        bullet.renderUpdate(dt);
        return bullet;
      })
    });
  }, [state]);

  usePreditUpdate((dt) => {
    state.bullets.forEach(bullet => {
      bullet.preditUpdate(dt);
    });
  }, [state]);

  useLogicUpdate((dt) => {
    state.bullets.forEach((bullet, i) => {
      bullet.frameUpdate(dt);
      if (bullet.checkNotInScreen()) {
        updateState('bullets', {
          $splice: [
            [i, 1],
          ],
        });
      }
      // 碰撞检测的仲裁逻辑
      databus.playerList.forEach((player) => {
        // if (
        //   bullet.sourcePlayer !== player &&
        //   checkCircleCollision(player.collisionCircle(), bullet.collisionCircle)
        // ) {
        //   databus.removeBullets(bullet);
        //   player.hp--;

        //   player.hpRender.updateHp(player.hp);

        //   if (player.hp <= 0) {
        //     gameServer.settle();
        //     gameServer.endGame();
        //   }
        // }
      });
    });
  }, [state]);

  return state.bullets.map(bullet => (
    <Bullet
      key={bullet.id}
      width={bullet.width}
      height={bullet.height}
      x={bullet.x}
      y={bullet.y}
      rotation={bullet.rotation}
    />
  ));
};
