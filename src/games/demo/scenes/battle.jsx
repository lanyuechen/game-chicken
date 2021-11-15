import React, { memo, useState } from 'react';
import { Container } from '@inlet/react-pixi';
import Debug from '@/components/debug';
import CountDown from '@/components/count-down';
import JoyStick from '@/components/joystick';
import * as modal from '@/components/ui/modal';
import Back from '@/components/ui/back';

import config from '@/config';
import gameServer from '@/core/game-server';
import { databus } from '@/utils/databus';
import { MSG, ROLE } from '@/constant';

import Skill from '../base/skill';
import Bullets from '../base/bullets';
import Players from '../base/players';

export default memo(() => {
  const [active, setActive] = useState(true);

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

  return (
    <Container>
      <Bullets />
      <Players />
      <CountDown count={3} x={config.GAME_WIDTH / 2} y={330} onComplete={() => setActive(true)} />
      <JoyStick eventDispatch={handleJoyStick} disabled={!active} />
      <Skill eventDispatch={handleSkill} disabled={!active} />
      <Back onBack={() => showModal('离开房间会游戏结束！你确定吗？')} />
      <Debug />
    </Container>
  );
});
