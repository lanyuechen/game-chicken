/**
 * 全局状态管理器
 */
class DataBus {
  constructor() {
    this.userInfo = {};

    this.reset();
  }

  reset() {
    this.gameover = false;
    this.currAccessInfo = '';     // 加入房间必须
    this.bullets = [];
    this.playerMap = {};
    this.playerList = [];
    this.selfPosNum = 0;
    this.selfClientId = 1;
    this.selfMemberInfo = {};
    this.debugMsg = [];
    this.matchPattern = void 0;   // 为真时表示自动匹配
  }

  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */
  removeBullets(bullet) {
    this.bullets.splice(this.bullets.indexOf(bullet), 1);

    bullet.parent.removeChild(bullet);
  }
}

export default new DataBus();
