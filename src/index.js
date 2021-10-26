import config from '@/config.js';
import databus from '@/utils/databus';
import BackGround from '@/base/bg.js';
import Tween from '@/base/tween.js';
import gameServer from '@/utils/gameserver';
import login from '@/base/login.js';
import Room from '@/scenes/room.js';
import Battle from '@/scenes/battle.js';
// import Result      from '@/scenes/result.js';
import Home from '@/scenes/home.js';

export default class App extends PIXI.Application {
  constructor() {
    super({
      view: canvas,
      width: config.GAME_WIDTH,
      height: config.GAME_HEIGHT,
      antialias: true,
      backgroundColor: 0xffffff,
    });

    this.bindWxEvents();

    // 适配小游戏的触摸事件
    this.renderer.plugins.interaction.mapPositionToPoint = (point, x, y) => {
      point.x = x * 2 * (667 / window.innerWidth);
      point.y = y * 2 * (375 / window.innerHeight);
    };

    this.aniId = null;
    this.bindLoop = this.loop.bind(this);

    PIXI.Loader.shared.add(config.resources).load(this.init.bind(this));
  }

  runScene(Scene) {
    const old = this.stage.getChildByName('scene');
    if (old) {
      old.destroy(true);
    }

    const scene = new Scene();
    scene.name = scene.sceneName = 'scene';
    scene.launch(gameServer);
    this.stage.addChild(scene);

    return scene;
  }

  joinToRoom() {
    wx.showLoading({ title: '加入房间中' });
    gameServer
      .joinRoom(databus.currAccessInfo)
      .then((res) => {
        wx.hideLoading();
        let data = res.data || {};

        databus.selfClientId = data.clientId;
        gameServer.accessInfo = databus.currAccessInfo;
        this.runScene(Room);

        console.log('join', data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  scenesInit() {
    // 从会话点进来的场景
    if (databus.currAccessInfo) {
      this.joinToRoom();
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

  init() {
    this.scaleToScreen();

    this.bg = new BackGround();
    this.stage.addChild(this.bg);

    this.ticker.stop();
    this.timer = +new Date();
    this.aniId = window.requestAnimationFrame(this.bindLoop);

    login.do(() => {
      gameServer.login().then(() => {
        this.scenesInit();
      });
    });
  }

  scaleToScreen() {
    const x = window.innerWidth / 667;
    const y = window.innerHeight / 375;

    if (x > y) {
      this.stage.scale.x = y / x;
      this.stage.x = ((1 - this.stage.scale.x) / 2) * config.GAME_WIDTH;
    } else {
      this.stage.scale.y = x / y;
      this.stage.y = ((1 - this.stage.scale.y) / 2) * config.GAME_HEIGHT;
    }
  }

  _update(dt) {
    gameServer.update(dt);
    Tween.update();
  }

  loop() {
    let time = +new Date();
    this._update(time - this.timer);
    this.timer = time;
    this.renderer.render(this.stage);
    this.aniId = window.requestAnimationFrame(this.bindLoop);
  }

  bindWxEvents() {
    wx.onShow((res) => {
      console.log('wx.onShow', res);
      const accessInfo = res.query.accessInfo;

      if (!accessInfo) {
        return;
      }

      if (!databus.currAccessInfo) {
        databus.currAccessInfo = accessInfo;
        this.joinToRoom();
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

              this.joinToRoom();
            });
          },
        });

        return;
      }
    });
  }
}
