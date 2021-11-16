import config from '@/config';
import login from '@/core/login';
import gameServer from '@/core/game-server';
import { databus } from '@/utils/databus';

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
    console.log('[onLogin]');
  }

  onShow(data) {
    console.log('[onShow]', data);
  }

  onLoop() {
    // console.log('[onLoop]', dt);
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
    this.onLoop(time - this.timer);
    this.timer = time;
    this.renderer.render(this.stage);
    this.aniId = window.requestAnimationFrame(this.bindLoop);
  }
}
