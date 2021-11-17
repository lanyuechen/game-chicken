import { getDeviceInfo } from '@/utils/utils';

const deviceinfo = getDeviceInfo();

export default {
  debug: true,

  matchId: 'XERc0AcOphf3E5ajvATi8kaYvzgWusxONmjMuD8JP60',

  dpr: 2,
  windowWidth: deviceinfo.windowWidth,
  windowHeight: deviceinfo.windowHeight,

  VIEW_WIDTH: 667,
  VIEW_HEIGHT: 375,
  
  GAME_WIDTH: 667 * 2,
  GAME_HEIGHT: 375 * 2,

  deviceinfo,

  resources: [
    'images/bg.png',
    'images/aircraft1.png',
    'images/aircraft2.png',
    'images/bullet_blue.png',
    'images/default_user.png',
    'images/avatar_default.png',
    'images/hosticon.png',
    'images/iconready.png',
  ],

  playerHp: 100,
};
