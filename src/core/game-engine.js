import config from '@/config';
import login from '@/core/login';
import gameServer from '@/core/game-server';
import databus from '@/core/databus';
import Tween from '@/core/tween';
import { ROLE } from '@/constant';

export default class extends PIXI.Application {
  constructor() {
    super({
      view: canvas,
      width: config.GAME_WIDTH,
      height: config.GAME_HEIGHT,
      antialias: true,
      backgroundColor: 0xffffff,
    });

    // 适配小游戏的触摸事件
    this.renderer.plugins.interaction.mapPositionToPoint = (point, x, y) => {
      point.x = x * 2 * (config.VIEW_WIDTH / window.innerWidth);
      point.y = y * 2 * (config.VIEW_HEIGHT / window.innerHeight);
    };

    this.scaleToScreen();

    wx.onShow(this.onShow);

    this.aniId = null;
    this.bindLoop = this.loop.bind(this);

    PIXI.Loader.shared.add(config.resources).load(this.onLoadResource.bind(this));
  }

  /**
   * 资源加载完成后执行
   */
   onLoadResource() {
    this.onLoad();

    this.ticker.stop();
    this.timer = Date.now();
    this.aniId = window.requestAnimationFrame(this.bindLoop);

    login.do(() => {
      this.onLogin();
    });
  }

  onLoad() {
    console.log('[onLoad]');
  }

  onLogin() {
    gameServer.login().then(() => {
      if (databus.currAccessInfo) {
        this.joinRoom().then(() => gameServer.event.emit('createRoom'));
      } else {
        gameServer.event.emit('backHome');
      }
    });
  }

  onShow(res) {
    console.log('[wx.onShow]', res);
    const accessInfo = res.query.accessInfo;

    if (!accessInfo) {
      return;
    }

    if (!databus.currAccessInfo) {
      databus.currAccessInfo = accessInfo;
      this.joinRoom().then(() => gameServer.event.emit('createRoom'));
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

            this.joinRoom().then(() => gameServer.event.emit('createRoom'));
          });
        },
      });
    }
  }

  /**
   * 游戏视口自适应
   */
  scaleToScreen() {
    const x = window.innerWidth / config.VIEW_WIDTH;
    const y = window.innerHeight / config.VIEW_HEIGHT;

    if (x > y) {
      this.stage.scale.x = y / x;
      this.stage.x = ((1 - this.stage.scale.x) / 2) * config.GAME_WIDTH;
    } else {
      this.stage.scale.y = x / y;
      this.stage.y = ((1 - this.stage.scale.y) / 2) * config.GAME_HEIGHT;
    }
  }

  joinRoom() {
    wx.showLoading({ title: '加入房间中' });
    return gameServer
      .joinRoom(databus.currAccessInfo)
      .then(({ data = {} }) => {
        wx.hideLoading();

        databus.selfClientId = data.clientId;
        gameServer.accessInfo = databus.currAccessInfo;
        
        return data;
      });
  }

  loop() {
    let time = Date.now();

    gameServer.update(time - this.timer);
    Tween.update();

    this.timer = time;
    this.renderer.render(this.stage);
    this.aniId = window.requestAnimationFrame(this.bindLoop);
  }
}
