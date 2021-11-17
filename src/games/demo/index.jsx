import React, { useEffect, useState } from 'react';
import { Container, useApp } from '@inlet/react-pixi';

import gameServer from '@/core/game-server';
import Tween from '@/core/tween';
import databus from '@/core/databus';
import { ROLE } from '@/constant';

import Background from './base/bg';
import Home from './scenes/home';
import Room from './scenes/room';
import Battle from './scenes/battle';

export default () => {
  const app = useApp();
  const [loading, setLoading] = useState(true);
  const [scene, setScene] = useState('home');

  useEffect(() => {
    app.onLoad = () => setLoading(false);

    if (databus.currAccessInfo) {
      app.joinRoom().then(() => setScene('room'));
    }

    gameServer.event.on('backHome', () => {
      setScene('home');
    });

    gameServer.event.on('createRoom', () => {
      setScene('room');
    });

    gameServer.event.on('gameStart', () => {
      setScene('battle');
    });

    gameServer.event.on('gameEnd', () => {
      gameServer.gameResult.forEach((member) => {
        if (member.nickname === databus.userInfo.nickName) {
          wx.showModal({
            content: member.win ? '你已获得胜利' : '你输了',
            confirmText: '返回首页',
            confirmColor: '#02BB00',
            showCancel: false,
            success: () => {
              gameServer.clear();
            },
          });
        }
      });
    });

    return () => {
      gameServer.event.off('backHome');
      gameServer.event.off('createRoom');
      gameServer.event.off('gameStart');
      gameServer.event.off('gameEnd');
    }
  }, []);

  if (loading) {
    return null;
  }
  
  return (
    <Container>
      <Background image="images/bg.png" />
      {scene === 'home' && <Home />}
      {scene === 'room' && <Room />}
      {scene === 'battle' && <Battle />}
    </Container>
  )
}
