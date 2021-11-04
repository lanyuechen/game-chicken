import React, { useMemo } from 'react';
import { Container, Text } from '@inlet/react-pixi';
import Debug from '@/components/debug';
import Player from '../base/player';
import Hp from '../base/hp';
import JoyStick from '../base/joystick';


import config from '@/config';
import gameServer from '@/core/game-server';

// import JoyStick from '@/base/joystick';
// import Player from '@/base/player';
import Skill from '@/base/skill';
// import Hp from '@/base/hp';
// import Debug from '@/base/debug';
import databus from '@/core/databus';
import { createBtn, createText } from '@/utils/ui';
import { checkCircleCollision } from '@/utils/utils';

export default () => {
  const members = useMemo(() => {
    return gameServer.roomInfo.memberList || [];
  }, []);

  const handleSetPlayer = (clientId, player) => {
    databus.playerMap[clientId] = player;
    databus.playerList.push(player);
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
      <JoyStick />
    </Container>
  );
}

class Battle extends PIXI.Container {
  constructor() {
    super();
  }

  launch() {
    this.initPlayer();

    // 虚拟摇杆
    this.joystick = new JoyStick((e) => {
      let evt =
        e === -9999
          ? { e: config.msg.MOVE_STOP, n: databus.selfClientId }
          : { e: config.msg.MOVE_DIRECTION, n: databus.selfClientId, d: e.degree };
      gameServer.uploadFrame([JSON.stringify(evt)]);
    });
    this.addChild(this.joystick);

    // 技能按钮
    this.skill = new Skill();
    this.skill.eventemitter.on('click', () => {
      gameServer.uploadFrame([
        JSON.stringify({
          e: config.msg.SHOOT,
          n: databus.selfClientId,
        }),
      ]);
    });
    this.addChild(this.skill);

    this.appendBackBtn();

    this.onRoomInfoChange();
  }

  appendBackBtn() {
    const back = createBtn({
      img: 'images/goBack.png',
      x: 104,
      y: 68,
      onclick: () => {
        this.showModal('离开房间会游戏结束！你确定吗？');
      },
    });

    this.addChild(back);
  }

  onRoomInfoChange() {
    gameServer.event.on(
      'onRoomInfoChange',
      ((res) => {
        res.memberList.length < 2 && this.showModal('对方已离开房间，无法继续进行PK！', true);
      }).bind(this),
    );
  }

  createPlayerInformation(hp, nickname, isName, fn) {
    let name, value;
    isName &&
      (name = createText({
        str: nickname,
        style: { fontSize: 28, align: 'center', fill: '#1D1D1D' },
        left: true,
        x: hp.graphics.x,
        y: 96,
      }));
    value = createText({
      str: '生命值：',
      style: {
        fontSize: 24,
        fill: '#383838',
      },
      y: hp.graphics.y + hp.graphics.height / 2,
    });

    fn(name, value);
  }

  renderCount(count) {
    this.countdownText = createText({
      str: `倒计时${count}秒`,
      x: config.GAME_WIDTH / 2,
      y: 330,
    });
    this.addChild(this.countdownText);
  }

  addCountdown(count) {
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

  renderUpdate(dt) {
    if (databus.gameover) {
      return;
    }

    databus.playerList.forEach((player) => {
      player.renderUpdate(dt);
    });
    databus.bullets.forEach((bullet) => {
      bullet.renderUpdate(dt);
    });
  }

  logicUpdate(dt, frameId) {
    if (databus.gameover) {
      return;
    }

    // 收到第一帧开始倒计时
    if (frameId === 1) {
      this.addCountdown(3);
    }

    // 倒计时后允许操作
    if (frameId === parseInt(3000 / gameServer.fps)) {
      console.log('joystick enable');
      this.joystick.enable();
      this.skill.enable();
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

  // 指令输入后，计算下一个逻辑帧的状态，方便渲染帧逼近
  preditUpdate(dt) {
    databus.playerList.forEach((player) => {
      player.preditUpdate(dt);
    });

    databus.bullets.forEach((bullet) => {
      bullet.preditUpdate(dt);
    });
  }

  showModal(content, isCancel) {
    wx.showModal({
      title: '温馨提示',
      content,
      showCancel: !isCancel,
      success: (res) => {
        if (res.confirm) {
          if (databus.selfMemberInfo.role === config.roleMap.owner) {
            gameServer.ownerLeaveRoom();
          } else {
            gameServer.memberLeaveRoom();
          }
        }
      },
    });
  }

  _destroy() {
    gameServer.event.off('onRoomInfoChange');
  }
}
