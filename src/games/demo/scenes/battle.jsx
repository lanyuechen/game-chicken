import React, { memo, useEffect, useMemo, useState } from 'react';
import { Container, Text } from '@inlet/react-pixi';
import Debug from '@/components/debug';
import * as modal from '@/components/ui/modal';
import Button from '@/components/ui/button';
import CountDown from '@/components/count-down';
import Player from '../base/player';
import Hp from '../base/hp';
import JoyStick from '../base/joystick';
import Skill from '../base/skill';
import Bullets from '../base/bullets';

import config from '@/config';
import gameServer from '@/core/game-server';
import databus from '@/core/databus';
import { getTextWidth } from '@/utils/utils';
import { useLogicUpdate } from '@/utils/use-tick';

export default memo(() => {
  const [active, setActive] = useState(true);

  useLogicUpdate((dt, frameId) => {
    // 收到第一帧开始倒计时
    if (frameId === 1) {
      // this.addCountdown(3);
    }

    // 倒计时后允许操作
    if (frameId === parseInt(3000 / gameServer.fps)) {
      console.log('joystick enable');
      setActive(true);
    }
  }, []);

  const members = useMemo(() => {
    return (gameServer.roomInfo.memberList || []).filter(d => d.clientId !== undefined);
  }, []);

  useEffect(() => {
    gameServer.event.on('onRoomInfoChange', (res) => {
      res.memberList.length < 2 && showModal('对方已离开房间，无法继续进行PK！', false);
    });
    return () => {
      gameServer.event.off('onRoomInfoChange');
    }
  }, []);

  const handleSetPlayer = (clientId, player) => {
    if (player) {
      databus.playerMap[clientId] = player;
      databus.playerList.push(player);
    }
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

  const showModal = (content, showCancel = true) => {
    modal.show({
      content, 
      showCancel,
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
        const isLeft = member.role === config.roleMap.owner || (databus.matchPattern && i);
        const width = getTextWidth('生命值：', { fontSize: 24 });
        return (
          <Container key={member.clientId} x={isLeft ? 0 : config.GAME_WIDTH - 231 - 253 - 330}>
            <Hp width={231} height={22} x={330} y={56} hp={config.playerHp} />
            <Text
              text={member.nickname}
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
      {members.map((member, i) => {
        const isLeft = member.role === config.roleMap.owner || (databus.matchPattern && i);
        return (
          <Player
            key={member.clientId}
            ref={(ele) => handleSetPlayer(member.clientId, ele, member)}
            userInfo={member}
            x={isLeft ? 90 / 2 : config.GAME_WIDTH - 90 / 2}
            y={config.GAME_HEIGHT / 2}
            rotation={isLeft ? 0 : Math.PI}
          />
        );
      })}
      <Bullets />
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
      {/* <CountDown count={3} x={config.GAME_WIDTH / 2} y={330} /> */}
    </Container>
  );
});
