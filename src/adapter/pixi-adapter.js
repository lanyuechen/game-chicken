import { ShaderSystem } from '@pixi/core';
import { install } from '@pixi/unsafe-eval';

install({ ShaderSystem });

PIXI.CanvasResource.test = function (source) {
  return source.type === 'canvas';
};

window.self = window;
window.XMLDocument = function () {};
