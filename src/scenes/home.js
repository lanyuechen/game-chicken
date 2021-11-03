import config from '@/config';
import gameServer from '@/core/game-server';

import databus from '@/core/databus';
import { createBtn, createText } from '@/utils/ui';

import Debug from '../base/debug.js';

export default class Home extends PIXI.Container {
  constructor() {
    super();

    this.debug = new Debug();
    this.addChild(this.debug);
  }

  launch() {
    databus.matchPattern = void 0;
    this.appendOpBtn();
  }

  appendOpBtn() {
    this.addChild(
      createText({
        str: '小游戏帧同步功能示例',
        x: config.GAME_WIDTH / 2,
        y: 287,
        style: {
          fontSize: 64,
          fill: '#515151',
        },
      }),
      createBtn({
        img: 'images/quickStart.png',
        x: config.GAME_WIDTH / 2,
        y: 442,
        onclick: () => {
          if (gameServer.isVersionLow)
            return wx.showModal({
              content: '你的微信版本过低，无法演示该功能！',
              showCancel: false,
              confirmColor: '#02BB00',
            });

          gameServer.createMatchRoom();
        },
      }),
      createBtn({
        img: 'images/createRoom.png',
        x: config.GAME_WIDTH / 2,
        y: 582,
        onclick: () => {
          if (this.handling) {
            return;
          }
          this.handling = true;
          wx.showLoading({
            title: '房间创建中...',
          });
          gameServer.createRoom({}, () => {
            wx.hideLoading();
            this.handling = false;
          });
        },
      }),
    );
  }
}
