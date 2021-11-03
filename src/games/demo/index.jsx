import React, { useEffect, useState } from 'react';
import { Container, useApp } from '@inlet/react-pixi';

import Background from './bg';
import Home from './scenes/home';

import config from '@/config';
import gameServer from '@/core/game-server';
import databus from '@/core/databus';

import Tween from '@/base/tween';
import Room from '@/scenes/room';
import Battle from '@/scenes/battle';
// import Result      from '@/scenes/result';

export default () => {
  const app = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    app.onLoad = () => setLoading(false);
    app.onLogin = handleLogin;
    app.onShow = handleShow;
    app.onLoop = (dt) => {
      gameServer.update(dt);
      Tween.update();
    }

  }, []);

  const sceneInit = () => {
    // 从会话点进来的场景
    if (databus.currAccessInfo) {
      app.joinRoom().then(() => app.runScene(Room));
    } else {
      app.runScene(Home);
    }

    gameServer.event.on('backHome', () => {
      app.runScene(Home);
    });

    gameServer.event.on('createRoom', () => {
      app.runScene(Room);
    });

    gameServer.event.on('onGameStart', () => {
      databus.gameInstance = app.runScene(Battle);
    });

    gameServer.event.on('onGameEnd', () => {
      gameServer.gameResult.forEach((member) => {
        var isSelf = member.nickname === databus.userInfo.nickName;
        isSelf &&
          wx.showModal({
            content: member.win ? '你已获得胜利' : '你输了',
            confirmText: '返回首页',
            confirmColor: '#02BB00',
            showCancel: false,
            success: () => {
              gameServer.clear();
            },
          });
      });
    });
  }

  const handleLogin = () => {
    gameServer.login().then(() => {
      sceneInit();
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
      app.joinRoom().then(() => app.runScene(Room));
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
            databus.selfMemberInfo.role === config.roleMap.owner
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

            app.joinRoom().then(() => app.runScene(Room));
          });
        },
      });

      return;
    }
  }

  if (loading) {
    return null;
  }
  
  return (
    <Container>
      <Background image="images/bg.png" />
      <Home />
    </Container>
  )
}
