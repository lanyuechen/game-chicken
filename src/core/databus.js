import { useState } from 'react';
import set from 'lodash.set';
import get from 'lodash.get';

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

  update(path, value) {
    set(this, path, value);
  }

  useState(path) {
    const [state, setState] = useState(get(this, path));
  
    return [
      state,
      (newState) => {
        set(this, path, newState);
        setState(get(this, path));
      },
    ];
  }
}

export default new Databus();
