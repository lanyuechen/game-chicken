import React, { useMemo } from 'react';
import { Container, Text, Sprite } from '@inlet/react-pixi';
import Button from '@/components/ui/button';

import config from '@/config';
import gameServer from '@/core/game-server';
import { ROLE } from '@/constant';

const PADDING = 100;

export default () => {

  const members = useMemo(() => {
    const [a, b] = gameServer.gameResult;
    if (a.win) {
      return [a, b];
    }
    return [b, a];
  }, []);

  return (
    <Container>
      <Text
        text="1V1对战"
        style={{ fontSize: 36 }}
        anchor={0.5}
        x={config.GAME_WIDTH / 2}
        y={100}
      />
      <Text
        text="胜"
        style={{ fontSize: 36 }}
        anchor={0.5}
        x={config.GAME_WIDTH / 2}
        y={330}
      />
      {members.map((member, i) => (
        <Sprite
          key={i}
          image={member.headimg}
          name="player"
          x={i === 0 ? config.GAME_WIDTH / 2 - 100 - PADDING : config.GAME_WIDTH / 2 + PADDING}
          y={266}
          width={100}
          height={100}
          interactive={member.isEmpty}
          onPointerDown={() => {
            wx.shareAppMessage({
              title: '帧同步demo',
              query: 'accessInfo=' + gameServer.accessInfo,
              imageUrl: 'https://res.wx.qq.com/wechatgame/product/luban/assets/img/sprites/bk.jpg',
            });
          }}
        >
          <Text
            text={member.nickname}
            style={{ fontSize: 36, fill: '#515151' }}
            anchor={0.5}
            x={100 / 2}
            y={100 + 70}
          />
          {member.role === ROLE.OWNER && (
            <Sprite
              image="images/hosticon.png"
              width={30}
              height={30}
            />
          )}
        </Sprite>
      ))}
      <Button
        image="images/btn_bg.png"
        x={config.GAME_WIDTH / 2}
        y={config.GAME_HEIGHT - 150}
        onClick={() => gameServer.clear()}
      >
        确定
      </Button>
    </Container>
  );
}
