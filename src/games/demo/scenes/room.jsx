import React, { useEffect, useState } from 'react';
import { Container, Text, Sprite } from '@inlet/react-pixi';
import Button from '@/components/ui/button';

import config from '@/config';
import gameServer from '@/core/game-server';
import databus from '@/core/databus';
import { ROLE } from '@/constant';
import { showTip } from '@/utils/utils';

const emptyUser = {
  clientId: 'xxx',
  nickname: '点击邀请好友',
  headimg: 'images/avatar_default.png',
  isEmpty: true,
  isReady: true,
};

const PADDING = 136;

export default () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    gameServer.event.on('roomInfoChange', (roomInfo) => {
      setMembers(roomInfo.memberList || []);
    });

    if (!databus.matchPattern) {
      gameServer.getRoomInfo().then((roomInfo) => {
        setMembers(roomInfo.memberList || []);
      });
    } else {
      gameServer.getRoomInfo().then((roomInfo) => {
        console.log('match pattern roomInfo', roomInfo)
      });

      const { avatarUrl, nickName } = databus.userInfo;
      setMembers([
        { headimg: avatarUrl, nickname: nickName, isEmpty: false },
        {
          headimg: 'images/avatar_default.png',
          nickname: '正在匹配玩家...',
          isEmpty: false,
        },
      ]);
    }
    
    return () => {
      gameServer.event.off('roomInfoChange');
    }
  }, []);

  if (members.length === 1) {
    setMembers([...members, emptyUser]);
  }

  const allReady = !members.find(member => !member.isReady);
  const myself = members.find(member => member.clientId === databus.selfClientId);
  if (myself) {
    databus.selfPosNum = myself.posNum;
    databus.selfMemberInfo = myself;
  }

  return (
    <Container>
      <Text
        text="1V1对战"
        style={{ fontSize: 56, fill: '#515151' }}
        anchor={0.5}
        x={config.GAME_WIDTH / 2}
        y={96}
      />
      <Text
        text="VS"
        style={{ fontSize: 64, fill: '#515151' }}
        anchor={0.5}
        x={config.GAME_WIDTH / 2}
        y={307}
      />
      {members.map((member, i) => (
        <Sprite
          key={i}
          image={member.headimg}
          name="player"
          x={i === 0 ? config.GAME_WIDTH / 2 - 144 - PADDING : config.GAME_WIDTH / 2 + PADDING}
          y={266}
          width={144}
          height={144}
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
            x={144 / 2}
            y={144 + 23}
          />
          {member.role === ROLE.OWNER && (
            <Sprite
              image="images/hosticon.png"
              scale={0.8}
              y={-30}
            />
          )}
          {member.isReady && !databus.matchPattern && (
            <Sprite
              image="images/iconready.png"
              width={40}
              height={40}
              x={144}
            />
          )}
        </Sprite>
      ))}
      {myself && !databus.matchPattern && (
        <>
          <Button
            image="images/getReady.png"
            x={config.GAME_WIDTH / 2 - 159}
            y={config.GAME_HEIGHT - 160}
            alpha={myself.isReady ? 0.5 : 1}
            onClick={() => {
              gameServer.updateReadyStatus(!myself.isReady);
            }}
          />
          {myself.role === ROLE.OWNER && (
            <Button
              image="images/start.png"
              x={config.GAME_WIDTH / 2 + 159}
              y={config.GAME_HEIGHT - 160}
              alpha={!allReady ? 0.5 : 1}
              onClick={() => {
                if (!allReady) {
                  showTip('全部玩家准备后方可开始');
                } else {
                  gameServer.server.broadcastInRoom({
                    msg: 'START',
                  });
                }
              }}
            />
          )}
        </>
      )}
      <Button
        image="images/goBack.png"
        x={104}
        y={68}
        onClick={() => {
          wx.showModal({
            title: '温馨提示',
            content: '是否离开房间？',
            success: (res) => {
              if (res.confirm) {
                if (databus.matchPattern) {
                  gameServer.cancelMatch({
                    matchId: config.matchId,
                  });
                  gameServer.clear();
                  return;
                }
    
                if (databus.selfMemberInfo.role === ROLE.OWNER) {
                  gameServer.ownerLeaveRoom();
                } else {
                  gameServer.memberLeaveRoom();
                }
              }
            },
          });
        }}
      />
    </Container>
  );
}
