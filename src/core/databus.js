class Databus {
  constructor() {
    this.matchPattern = void 0;
    this.players = [];
    this.bullets = [];

    this.selfClientId = 1;
    this.selfPosNum = 0;
    this.selfMemberInfo = {};
    this.currAccessInfo = '';
    this.userInfo = {};
  }
}

export default new Databus();
