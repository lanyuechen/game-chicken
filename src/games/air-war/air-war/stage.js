export default class Stage extends PIXI.Container {
  constructor({ margin } = {}) {
    super();

    this.margin = margin || 16;

    const { statusBarHeight, windowWidth, windowHeight } = wx.getSystemInfoSync();
    const menuRect = wx.getMenuButtonBoundingClientRect();

    this.x = this.margin;
    this.y = menuRect ? menuRect.top + menuRect.bottom - statusBarHeight : 46;
    this.stageWidth = windowWidth - this.margin * 2;
    this.stageHeight = windowHeight - this.y - this.margin;
  }
}