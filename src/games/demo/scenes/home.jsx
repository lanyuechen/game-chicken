import React, { useEffect } from 'react';
import { Container, Sprite, Text } from '@inlet/react-pixi';

import Debug from '@/components/debug';

import config from '@/config';
import databus from '@/core/databus';
import gameServer from '@/core/game-server';

export default () => {
  useEffect(() => {
    databus.matchPattern = void 0;
  }, []);

  return (
    <Container>
      <Debug />
      <Text
        text="小游戏帧同步功能示例"
        x={config.GAME_WIDTH / 2}
        y={287}
        anchor={0.5}
        style={{
          fontSize: 64,
          fill: '#515151',
        }}
      />
      <Sprite
        image="images/quickStart.png"
        x={config.GAME_WIDTH / 2}
        y={422}
        anchor={0.5}
        onClick={() => {
          if (gameServer.isVersionLow)
            return wx.showModal({
              content: '你的微信版本过低，无法演示该功能！',
              showCancel: false,
              confirmColor: '#02BB00',
            });

          gameServer.createMatchRoom();
        }}
      />
      <Sprite
        image="images/createRoom.png"
        x={config.GAME_WIDTH / 2}
        y={582}
        anchor={0.5}
        onClick={() => {
          // if (this.handling) {
          //   return;
          // }
          // this.handling = true;
          wx.showLoading({
            title: '房间创建中...',
          });
          gameServer.createRoom({}, () => {
            wx.hideLoading();
            // this.handling = false;
          });
        }}
      />
    </Container>
  );
}

