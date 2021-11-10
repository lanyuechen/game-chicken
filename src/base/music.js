class Music {
  constructor() {
    //this.playBgm();

    this.shoot = wx.createInnerAudioContext();
    this.shoot.src = 'sounds/shoot.mp3';
  }

  playBgm() {
    let ctx = wx.createInnerAudioContext();

    ctx.src = 'sounds/bg.mp3';
    ctx.loop = true;

    ctx.play();
  }

  playShoot() {
    this.shoot.play();
  }
}

export default new Music();
