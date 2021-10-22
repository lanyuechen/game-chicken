import Stage from './stage';
import SceneDeploy from './scene-deploy';
import SceneGame from './scene-game';
import Rectangle from './rectangle';

import { generateMatrix } from '../utils/utils';

export default class AirWar extends Stage {
  constructor() {
    super();

    this.row = 8;
    this.col = 10;
    this.gridWidth = this.stageWidth / this.col;

    this.board = generateMatrix(this.row, this.col);

    const sceneDeploy = new SceneDeploy({
      row: this.row,
      col: this.col,
      board: this.board,
      gridWidth: this.gridWidth,
    });

    const sceneGame = new SceneGame({
      row: this.row,
      col: this.col,
      board: this.board,
      gridWidth: this.gridWidth,
    });
    sceneGame.visible = false;
    
    this.addChild(sceneDeploy);
    this.addChild(sceneGame);

    const btn = new Rectangle(0, 0, 20);
    btn.y = 450;
    btn.on('pointertap', () => {
      sceneDeploy.visible = !sceneDeploy.visible;
      sceneGame.visible = !sceneGame.visible;
    })

    this.addChild(btn);
  };
}