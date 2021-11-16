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
  const [scene, setScene] = useState('battle');

  useEffect(() => {
    app.onLoad = () => setLoading(false);
    app.onLogin = handleLogin;
    app.onShow = handleShow;
    app.onLoop = (dt) => {
      gameServer.update(dt);
      Tween.update();
    }

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

  }, []);

  const handleLogin = () => {
    gameServer.login().then(() => {
      if (databus.currAccessInfo) {
        app.joinRoom().then(() => setScene('room'));
      } else {
        setScene('home');
      }
    });
  }

  const handleShow = (res) => {
    console.log('wx.onShow', res);
    const accessInfo = res.query.accessInfo;

    if (!accessInfo) {
      return;
    }

    if (!databus.currAccessInfo) {
      databus.currAccessInfo = accessInfo;
      app.joinRoom().then(() => setScene('room'));
      return;
    }

    if (accessInfo !== databus.currAccessInfo) {
      wx.showModal({
        title: '温馨提示',
        content: '你要离开当前房间，接受对方的对战邀请吗？',
        success: (res) => {
          if (!res.confirm) {
            return;
          }
          const room =
            databus.selfMemberInfo.role === ROLE.OWNER
              ? 'ownerLeaveRoom'
              : 'memberLeaveRoom';

          gameServer[room]((res) => {
            if (res.errCode) {
              return wx.showToast({
                title: '离开房间失败！',
                icon: 'none',
                duration: 2000,
              });
            }

            databus.currAccessInfo = accessInfo;

            app.joinRoom().then(() => setScene('room'));
          });
        },
      });
    }
  }

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
