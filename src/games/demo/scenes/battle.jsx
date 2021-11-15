import React, { memo, useState } from 'react';
import { Container } from '@inlet/react-pixi';
import Debug from '@/components/debug';
import Button from '@/components/ui/button';
import CountDown from '@/components/count-down';
import JoyStick from '@/components/joystick';
import * as modal from '@/components/ui/modal';

import config from '@/config';
import gameServer from '@/core/game-server';
import { useLogicUpdate } from '@/utils/use-tick';
import { databus } from '@/utils/databus';
import { MSG, ROLE } from '@/constant';

import Skill from '../base/skill';
import Bullets from '../base/bullets';
import Players from '../base/players';

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
      <Debug />
    </Container>
  );
});
