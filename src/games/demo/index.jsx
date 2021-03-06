import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router';
import { Container, useApp } from '@inlet/react-pixi';

import gameServer from '@/core/game-server';
import databus from '@/core/databus';

import Background from './base/bg';
import Home from './scenes/home';
import Room from './scenes/room';
import Battle from './scenes/battle';

export default () => {
  const app = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    app.onLoad = () => setLoading(false);

    if (databus.currAccessInfo) {
      app.joinRoom().then(() => navigate('/home'));
    }

    gameServer.event.on('backHome', () => {
      navigate('/home');
    });

    gameServer.event.on('createRoom', () => {
      navigate('/room');
    });

    gameServer.event.on('gameStart', () => {
      navigate('/battle');
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
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/room" element={<Room />} />
        <Route path="/battle" element={<Battle />} />
      </Routes>
    </Container>
  )
}
