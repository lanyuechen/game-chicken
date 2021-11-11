import React from 'react';
import { Container, Text } from '@inlet/react-pixi';

import config from '@/config';
import { databus } from '@/utils/databus';
import { useRenderUpdate, useLogicUpdate, usePreditUpdate } from '@/utils/use-tick';
import { getTextWidth } from '@/utils/utils';

import Player from '../player';
import Hp from '../hp';

export default () => {

  useRenderUpdate((dt) => {
    
  }, []);

  usePreditUpdate((dt) => {
    
  }, []);

  useLogicUpdate((dt) => {
    
  }, []);

  const members = databus.players;

  const handleSetPlayer = (clientId, player) => {
    if (player) {
      databus.playerMap[clientId] = player;
      databus.playerList.push(player);
    }
  }

  console.log('=====players render')

  return (
    <Container>
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
    </Container>
  );
};
