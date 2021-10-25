window.self = window;
window.XMLDocument = function () {};

import './libs/wechat-adapter/index';
import './libs/pixi';
import './libs/unsafe-eval.min';

import App from './src/index';

new App();
