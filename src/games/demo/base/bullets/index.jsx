import React from 'react';

import { useRenderUpdate, useLogicUpdate, usePreditUpdate } from '@/utils/use-tick';
import { databus, useUpdate } from '@/utils/databus';
import { checkCircleCollision } from '@/utils/utils';
import gameServer from '@/core/game-server';

import Bullet from './bullet';

export default () => {
  const update = useUpdate();

  // useRenderUpdate((dt) => {
  //   databus.bullets.forEach((bullet, i) => {
  //     update(['bullets', i], {
  //       $set: bullet.clone().renderUpdate(dt)
  //     });
  //   });
  // });

  useRenderUpdate((dt) => {
    update('bullets', {
      $set: databus.bullets.map(bullet => {
        bullet.renderUpdate(dt);
        return bullet;
      })
    });
  });

  usePreditUpdate((dt) => {
    databus.bullets.forEach((bullet, i) => {
      bullet.preditUpdate(dt);
      // update(['bullets', i], {
      //   $set: bullet,
      // });
    });
  });

  useLogicUpdate((dt) => {
    databus.bullets.forEach((bullet, i) => {
      bullet.frameUpdate(dt);
      if (bullet.checkNotInScreen()) {
        update('bullets', {
          $splice: [
            [i, 1],
          ],
        });
      }
      // 碰撞检测的仲裁逻辑
      databus.players.forEach((player) => {
        if (
          bullet.clientId !== player.clientId && 
          checkCircleCollision(player.collisionCircle, bullet.collisionCircle)
        ) {
          update('bullets', {
            $splice: [
              [i, 1],
            ],
          });
        //   player.hp--;

        //   player.hpRender.updateHp(player.hp);

          if (player.hp <= 0) {
            gameServer.settle();
            gameServer.endGame();
          }
        }
      });
    });
  });

  return databus.bullets.map(bullet => (
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
