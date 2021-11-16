import React, { useEffect, useCallback } from 'react';
import { Container, Text } from '@inlet/react-pixi';

import config from '@/config';
import { databus, useUpdate } from '@/utils/databus';
import { useRenderUpdate, useFrameUpdate, usePreditUpdate } from '@/utils/use-tick';
import { getTextWidth } from '@/utils/utils';
import MovableObject from '@/utils/movable-object';
import gameServer from '@/core/game-server';
import * as modal from '@/components/ui/modal';
import music from '@/core/music';
import { MSG, ROLE } from '@/constant';

import Player from './player';
import Hp from './hp';

export default () => {
  const update = useUpdate();

  useEffect(() => {
    gameServer.event.on('onRoomInfoChange', (roomInfo) => {
      if (roomInfo.memberList.length < 2) {
        modal.show({
          content: '对方已离开房间，无法继续进行PK！', 
          showCancel: false,
          onOk: () => {
            if (databus.selfMemberInfo.role === ROLE.OWNER) {
              gameServer.ownerLeaveRoom();
            } else {
              gameServer.memberLeaveRoom();
            }
          }
        });
      } else {
        updatePlayerList(roomInfo);
      }
    });

    gameServer.event.on('onActionList', (obj) => {
      databus.players.forEach(player => {
        if (player.clientId !== obj.n) {
          return;
        }
        switch (obj.e) {
          case MSG.SHOOT:
            shoot(player);
            break;
          case MSG.MOVE_DIRECTION:
            player.setDestRotation(obj.r);
            break;
          case MSG.MOVE_STOP:
            player.setSpeed(0);
            player.desDegree = player.frameDegree;
            break;
        }
      });
    });

    if (!databus.matchPattern) {
      gameServer.getRoomInfo().then((roomInfo) => {
        updatePlayerList(roomInfo);
      });
    } 

    return () => {
      gameServer.event.off('onRoomInfoChange');
      gameServer.event.off('onActionList');
    }
  }, []);

  const shoot = useCallback((player) => {
    const half = parseInt(45 * config.dpr / 2);
    const { x, y, rotation } = player;

    const bullet = new MovableObject({
      clientId: player.clientId,
      x: x + half * Math.cos(rotation),
      y: y + half * Math.sin(rotation),
      width: 10 * config.dpr,
      height: 5 * config.dpr,
      rotation: player.frameRotation,
      speed: 0.7,
    });

    update('bullets', {
      $push: [
        bullet
      ]
    });

    music.playShoot();
  }, []);

  const updatePlayerList = useCallback((roomInfo) => {
    const players = roomInfo.memberList.map((userInfo, i) => {
      const isLeft = userInfo.role === ROLE.OWNER|| (databus.matchPattern && i);

      return new MovableObject({
        ...userInfo,
        x: isLeft ? 90 / 2 : config.GAME_WIDTH - 90 / 2,
        y: config.GAME_HEIGHT / 2,
        width: 45 * config.dpr,
        height: 45 * config.dpr,
        rotation: isLeft ? 0 : Math.PI,
        hp: 100,
      });
    });

    // 电脑玩家
    players.push(new MovableObject({
      clientId: 999,
      nickname: '电脑玩家',
      x: config.GAME_WIDTH - 90 / 2,
      y: config.GAME_HEIGHT / 2,
      width: 45 * config.dpr,
      height: 45 * config.dpr,
      rotation: Math.PI,
      hp: 80,
    }));

    update('players', {
      $set: players
    });
  }, []);

  useRenderUpdate((dt) => {
    update('players', {
      $set: databus.players.map(player => {
        player.renderUpdate(dt);
        return player;
      })
    });
  }, []);

  usePreditUpdate((dt) => {
    databus.players.forEach(player => {
      player.preditUpdate(dt, true);
      // update(['players', i], {
      //   $set: player,
      // });
    });
  }, []);

  useFrameUpdate((dt) => {
    databus.players.forEach(player => {
      player.frameUpdate(dt, true);
      // update(['players', i], {
      //   $set: player,
      // });
    });
  }, []);

  return (
    <Container>
      {databus.players.map((player, i) => {
        const isLeft = player.role === ROLE.OWNER || (databus.matchPattern && i);
        const width = getTextWidth('生命值：', { fontSize: 24 });
        return (
          <Container key={player.clientId} x={isLeft ? 0 : config.GAME_WIDTH - 231 - 253 - 330}>
            <Hp width={231} height={22} x={330} y={56} maxHp={config.playerHp} hp={player.hp} />
            <Text
              text={player.nickname}
              style={{ fontSize: 28, fill: '#1D1D1D' }}
              x={330}
              y={96}
            />
            <Text
              text="生命值："
              style={{ fontSize: 24, fill: '#383838' }}
              anchor={0.5}
              x={330 - width / 2}
              y={56 + 22 / 2}
            />
          </Container>
        );
      })}
      {databus.players.map(player => {
        return (
          <Player
            key={player.clientId}
            clientId={player.clientId}
            x={player.x}
            y={player.y}
            width={player.width}
            height={player.height}
            rotation={player.rotation}
          />
        );
      })}
    </Container>
  );
};
