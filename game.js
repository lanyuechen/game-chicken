import './js/libs/wechat-adapter/index';
import './js/libs/symbol';
import './js/libs/pixi/pixi.min';
import './js/libs/pixi/unsafe-eval/unsafe-eval.min';

const { pixelRatio } = wx.getSystemInfoSync();

PIXI.InteractionManager.prototype.mapPositionToPoint = (point, x, y) => {
  point.x = x * pixelRatio
  point.y = y * pixelRatio
}

import Main from './js/main';

new Main();
