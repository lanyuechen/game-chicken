import React, { memo, useState, useEffect, useCallback } from 'react';
import { Container } from '@inlet/react-pixi';
import Debug from '@/components/debug';
import JoyStick from '@/components/joystick';
import * as modal from '@/components/ui/modal';
import Back from '@/components/ui/back';

import config from '@/config';
import gameServer from '@/core/game-server';
import databus from '@/core/databus';
import { MSG, ROLE } from '@/constant';
import music from '@/core/music';
import { uuid, checkCircleCollision } from '@/utils/utils';
import { usePreditUpdate } from '@/utils/use-tick';

import Skill from '../base/skill';
import Bullet from '../base/bullet';
import Players from '../base/players';

export default memo(() => {
  const [players, setPlayers] = useState([]);
  const [bullets, setBullets] = useState([]);

  useEffect(() => {
    gameServer.event.on('roomInfoChange', (roomInfo) => {
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

    if (!databus.matchPattern) {
      gameServer.getRoomInfo().then((roomInfo) => {
        updatePlayerList(roomInfo);
      });
    } 

    return () => {
      gameServer.event.off('onRoomInfoChange');
    }
  }, []);

  usePreditUpdate((dt) => {
    databus.bullets.forEach(bullet => {
      bullet.preditUpdate(dt);
      if (bullet.checkNotInScreen()) {
        handleRemoveBullet(bullet.id);
      }
      
      // 碰撞检测的仲裁逻辑
      databus.players.forEach(player => {
        if (
          bullet.clientId !== player.id && 
          checkCircleCollision(player.collisionCircle, bullet.collisionCircle)
        ) {
          handleRemoveBullet(bullet.id);
          
          player.hp--;
  
          if (player.hp <= 0) {
            gameServer.settle();
            gameServer.endGame();
          }

          setPlayers(players => players.map(d => {
            if (d.id === player.id) {
              return {
                ...d,
                hp: player.hp,
              }
            }
            return d;
          }));
        }
      });
    });
  });

  const updatePlayerList = useCallback((roomInfo) => {
    const players = roomInfo.memberList.map((userInfo, i) => {
      const isLeft = userInfo.role === ROLE.OWNER|| (databus.matchPattern && i);

      return {
        ...userInfo,
        id: userInfo.clientId,
        x: isLeft ? 90 : config.GAME_WIDTH - 90,
        y: config.GAME_HEIGHT / 2,
        rotation: isLeft ? 0 : Math.PI,
        hp: 100,
      };
    });

    // 电脑玩家
    players.push({
      id: 999,
      nickname: '电脑玩家',
      x: config.GAME_WIDTH - 90,
      y: config.GAME_HEIGHT / 2,
      rotation: Math.PI,
      hp: 80,
    });

    setPlayers(players);
  }, []);

  const handleJoyStick = (e) => {
    let evt =
      e === -9999
        ? { e: MSG.MOVE_STOP, n: databus.selfClientId }
        : { e: MSG.MOVE_DIRECTION, n: databus.selfClientId, r: e.radian };
    gameServer.uploadFrame([JSON.stringify(evt)]);
  }

  const handleSkill = () => {
    gameServer.uploadFrame([
      JSON.stringify({
        e: MSG.SHOOT,
        n: databus.selfClientId,
      }),
    ]);
  }

  const showModal = (content, showCancel = true) => {
    modal.show({
      content, 
      showCancel,
      onOk: () => {
        if (databus.selfMemberInfo.role === ROLE.OWNER) {
          gameServer.ownerLeaveRoom();
        } else {
          gameServer.memberLeaveRoom();
        }
      }
    });
  }

  const handleShoot = useCallback((player) => {
    const half = parseInt(45 * config.dpr / 2);
    const { x, y, rotation } = player;

    setBullets(bullets => [
      ...bullets,
      {
        id: uuid(),
        clientId: player.id,
        x: x + half * Math.cos(rotation),
        y: y + half * Math.sin(rotation),
        rotation: player.preditRotation,
        speed: 0.7,
      },
    ]);

    music.playShoot();
  }, []);

  const handleRemoveBullet = (id) => {
    setBullets(bullets => bullets.filter(d => d.id !== id));
  }

  console.log('[scene battle]');

  return (
    <Container>
      {bullets.map(bullet => (
        <Bullet
          key={bullet.id}
          id={bullet.id}
          clientId={bullet.clientId}
          width={bullet.width}
          height={bullet.height}
          x={bullet.x}
          y={bullet.y}
          rotation={bullet.rotation}
          onDestroy={() => handleRemoveBullet(bullet.id)}
        />
      ))}
      <Players players={players} onShoot={handleShoot} />
      <JoyStick eventDispatch={handleJoyStick} />
      <Skill eventDispatch={handleSkill} />
      <Back onBack={() => showModal('离开房间会游戏结束！你确定吗？')} />
      <Debug />
    </Container>
  );
});
