import config from '@/config';
import GameEngine from '@/core/game-engine';
import gameServer from '@/core/game-server';
import databus from '@/core/databus';

import BackGround from '@/base/bg';
import Tween from '@/base/tween';
import Room from '@/scenes/room';
import Battle from '@/scenes/battle';
// import Result      from '@/scenes/result';
import Home from '@/scenes/home';

export default class App extends GameEngine {
  constructor() {
    super();
  }

  onLoad() {
    this.bg = new BackGround();
    this.stage.addChild(this.bg);
  }

  onLogin() {
    gameServer.login().then(() => {
      this.sceneInit();
    });
  }

  sceneInit() {
    // 从会话点进来的场景
    if (databus.currAccessInfo) {
      this.joinRoom().then(() => this.runScene(Room));
    } else {
      this.runScene(Home);
    }

    gameServer.event.on('backHome', () => {
      this.runScene(Home);
    });

    gameServer.event.on('createRoom', () => {
      this.runScene(Room);
    });

    gameServer.event.on('onGameStart', () => {
      databus.gameInstance = this.runScene(Battle);
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

  onShow(res) {
    console.log('wx.onShow', res);
    const accessInfo = res.query.accessInfo;

    if (!accessInfo) {
      return;
    }

    if (!databus.currAccessInfo) {
      databus.currAccessInfo = accessInfo;
      this.joinRoom().then(() => this.runScene(Room));
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

            this.joinRoom().then(() => this.runScene(Room));
          });
        },
      });

      return;
    }
  }

  onLoop(dt) {
    gameServer.update(dt);
    Tween.update();
  }
}
