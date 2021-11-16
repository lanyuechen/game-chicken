import React from 'react';
import { Container, Text } from '@inlet/react-pixi';

import config from '@/config';
import databus from '@/core/databus';
import { getTextWidth } from '@/utils/utils';
import { ROLE } from '@/constant';

import Player from './player';
import Hp from './hp';

export default (props) => {
  const { players, onShoot } = props;

  console.log('[players]')

  return (
    <Container>
      {players.map((player, i) => {
        const isLeft = player.role === ROLE.OWNER || (databus.matchPattern && i);
        const width = getTextWidth('生命值：', { fontSize: 24 });
        return (
          <Container key={player.id} x={isLeft ? 0 : config.GAME_WIDTH - 231 - 253 - 330}>
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
      {players.map(player => {
        return (
          <Player
            key={player.id}
            id={player.id}
            x={player.x}
            y={player.y}
            rotation={player.rotation}
            onShoot={onShoot}
          />
        );
      })}
    </Container>
  );
};
