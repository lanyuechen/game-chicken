import AirWar from './air-war/index';

export default class Main {
  constructor() {
    this.app = new PIXI.Application({
      view: canvas,
      width: canvas.width,
      height: canvas.height,
      antialias: true,
      backgroundColor: 0xffffff
    });

    const airWar = new AirWar();

    this.app.stage.addChild(airWar);

  }
}
