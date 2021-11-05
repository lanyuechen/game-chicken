import React, { useEffect, useMemo, useImperativeHandle, forwardRef, useState } from 'react';
import { Container, Text } from '@inlet/react-pixi';
import Debug from '@/components/debug';
import * as modal from '@/components/ui/modal';
import Button from '@/components/ui/button';
import Player from '../base/player';
import Hp from '../base/hp';
import JoyStick from '../base/joystick';
import Skill from '../base/skill';

import config from '@/config';
import gameServer from '@/core/game-server';
import databus from '@/core/databus';
import { checkCircleCollision } from '@/utils/utils';

export default forwardRef((props, ref) => {

  useImperativeHandle(ref, () => ({
    renderUpdate: (dt) => {
      if (databus.gameover) {
        return;
      }
  
      databus.playerList.forEach((player) => {
        player.renderUpdate(dt);
      });
      databus.bullets.forEach((bullet) => {
        bullet.renderUpdate(dt);
      });
    },
    preditUpdate: (dt) => {
      databus.playerList.forEach((player) => {
        player.preditUpdate(dt);
      });
  
      databus.bullets.forEach((bullet) => {
        bullet.preditUpdate(dt);
      });
    },
    logicUpdate: (dt, frameId) => {
      if (databus.gameover) {
        return;
      }
  
      // 收到第一帧开始倒计时
      if (frameId === 1) {
        // this.addCountdown(3);
      }
  
      // 倒计时后允许操作
      if (frameId === parseInt(3000 / gameServer.fps)) {
        console.log('joystick enable');
        setActive(true);
      }
  
      databus.playerList.forEach((player) => {
        player.frameUpdate(dt);
      });
  
      databus.bullets.forEach((bullet) => {
        bullet.frameUpdate(dt);
        // 碰撞检测的仲裁逻辑
        databus.playerList.forEach((player) => {
          if (
            bullet.sourcePlayer !== player &&
            checkCircleCollision(player.collisionCircle, bullet.collisionCircle)
          ) {
            databus.removeBullets(bullet);
            player.hp--;
  
            player.hpRender.updateHp(player.hp);
  
            if (player.hp <= 0) {
              gameServer.settle();
              gameServer.endGame();
            }
          }
        });
      });
    }
  }));

  const [active, setActive] = useState(false);

  const members = useMemo(() => {
    return gameServer.roomInfo.memberList || [];
  }, []);

  useEffect(() => {
    gameServer.event.on('onRoomInfoChange', (res) => {
      res.memberList.length < 2 && showModal('对方已离开房间，无法继续进行PK！', true);
    });
    return () => {
      gameServer.event.off('onRoomInfoChange');
    }
  }, []);

  const addCountdown = (count) => {
    if (this.countdownText) {
      this.removeChild(this.countdownText);
    }

    this.renderCount(count--);
    if (count >= 0) {
      setTimeout(() => {
        this.addCountdown(count);
      }, 1000);
    } else {
      setTimeout(() => {
        this.removeChild(this.countdownText);
      }, 1000);
    }
  }

  const handleSetPlayer = (clientId, player) => {
    databus.playerMap[clientId] = player;
    databus.playerList.push(player);
  }

  const handleJoyStick = (e) => {
    let evt =
      e === -9999
        ? { e: config.msg.MOVE_STOP, n: databus.selfClientId }
        : { e: config.msg.MOVE_DIRECTION, n: databus.selfClientId, d: e.degree };
    gameServer.uploadFrame([JSON.stringify(evt)]);
  }

  const handleSkill = () => {
    gameServer.uploadFrame([
      JSON.stringify({
        e: config.msg.SHOOT,
        n: databus.selfClientId,
      }),
    ]);
  }

  const showModal = (content, isCancel) => {
    modal.show({
      content, 
      showCancel: !isCancel,
      onOk: () => {
        if (databus.selfMemberInfo.role === config.roleMap.owner) {
          gameServer.ownerLeaveRoom();
        } else {
          gameServer.memberLeaveRoom();
        }
      }
    });
  }

  return (
    <Container>
      <Debug />
      {members.map((member, i) => {
        const isLeft = member.role === config.roleMap.owner || (databus.matchPattern && i)
        return (
          <Container key={member.clientId}>
            <Player
              ref={(ele) => handleSetPlayer(member.clientId, ele)}
              userInfo={member}
    
              x={isLeft ? 90 / 2 : config.GAME_WIDTH - 90 / 2}
              frameX={isLeft ? 90 / 2 : config.GAME_WIDTH - 90 / 2}
              direction={isLeft ? 0 : 180}
              y={config.GAME_HEIGHT / 2}
              frameY={config.GAME_HEIGHT / 2}
            />
            <Hp width={231} height={22} x={0} y={56} hp={config.playerHp} />
            <Text
              text={member.nickname}
              style={{ fontSize: 28, fill: '#1D1D1D' }}
              x={0}
              y={96}
            />
            <Text
              text="生命值："
              style={{ fontSize: 24, fill: '#383838' }}
              x={100}
              y={96}
            />
          </Container>
        );
      })}
      <JoyStick eventDispatch={handleJoyStick} disabled={!active} />
      <Skill eventDispatch={handleSkill} disabled={!active} />
      <Button
        image="images/goBack.png"
        x={104}
        y={68}
        onClick={() => {
          showModal('离开房间会游戏结束！你确定吗？');
        }}
      />
      <Text text={`倒计时${3}秒`} x={config.GAME_WIDTH / 2} y={330} />
    </Container>
  );
});
