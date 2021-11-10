import React from 'react';

import databus from '@/core/databus';
import { useRenderUpdate, useLogicUpdate, usePreditUpdate } from '@/utils/use-tick';
import { useDatabusUpdate } from '@/utils/state';

import Bullet from './bullet';

export default () => {
  const updateState = useDatabusUpdate();

  useRenderUpdate((dt) => {
    updateState('bullets', {
      $set: DATABUS.bullets.map(bullet => {
        bullet.renderUpdate(dt);
        return bullet;
      })
    });
  }, []);

  usePreditUpdate((dt) => {
    DATABUS.bullets.forEach((bullet, i) => {
      bullet.preditUpdate(dt);
      updateState(['bullets', i], {
        $set: bullet,
      });
    });
  }, []);

  useLogicUpdate((dt) => {
    DATABUS.bullets.forEach((bullet, i) => {
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
  }, []);

  return DATABUS.bullets.map(bullet => (
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
