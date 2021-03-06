import React, { useEffect } from 'react';
import { Container, Text } from '@inlet/react-pixi';

import Button from '@/components/ui/button';

import config from '@/config';
import gameServer from '@/core/game-server';
import databus from '@/core/databus';

export default () => {
  useEffect(() => {
    databus.matchPattern = void 0;
  }, []);

  return (
    <Container>
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
      <Button
        image="images/quickStart.png"
        x={config.GAME_WIDTH / 2}
        y={422}
        onClick={() => {
          if (gameServer.isVersionLow) {
            return wx.showModal({
              content: '你的微信版本过低，升个级吧！',
              showCancel: false,
              confirmColor: '#02BB00',
            });
          }
            
          gameServer.createMatchRoom();
        }}
      />
      <Button
        image="images/createRoom.png"
        x={config.GAME_WIDTH / 2}
        y={582}
        onClick={() => {
          wx.showLoading({
            title: '房间创建中...',
          });
          gameServer.createRoom({}, () => {
            wx.hideLoading();
          });
        }}
      />
    </Container>
  );
}

