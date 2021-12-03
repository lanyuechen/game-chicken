import { getDeviceInfo } from '@/utils/utils';

const deviceinfo = getDeviceInfo();

const VIEW_WIDTH = 667;
const VIEW_HEIGHT = 375;
const MARGIN = 25;
const ROW = 10;
const COL = 12;

export default {
  dpr: 2,
  windowWidth: deviceinfo.windowWidth,
  windowHeight: deviceinfo.windowHeight,

  VIEW_WIDTH,
  VIEW_HEIGHT,
  
  GAME_WIDTH: VIEW_WIDTH * 2,
  GAME_HEIGHT: VIEW_HEIGHT * 2,

  margin: MARGIN,
  row: ROW,
  col: COL,
  gridWidth: Math.floor((VIEW_HEIGHT * 2 - MARGIN * 2) / ROW),

  deviceinfo,

  resources: [
    
  ],
};
