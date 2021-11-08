import React, { useState, useCallback } from 'react';
import { Container, Graphics, Sprite } from '@inlet/react-pixi';

import Button from '@/components/ui/button';
import useStore from '@/utils/use-store';

import config from '@/config';
import Tween from '@/base/tween';
import { none, convertRadian2Degree, convertDegree2Radian } from '@/utils/utils';

// 虚拟摇杆的大小
const JOYSTICKWIDTH = 128.7 * config.dpr;
const JOYSTICKHEIGHT = 128.7 * config.dpr;

const RADIUS = JOYSTICKWIDTH / 2;
const BUTTON_RADIUS = 25 * config.dpr;

// 虚拟摇杆的位置
const WRAPPER_X = 40 * config.dpr;
const WRAPPER_Y = config.GAME_HEIGHT - JOYSTICKHEIGHT - 40.3 * config.dpr;

const CENTER = {
  x: WRAPPER_X + RADIUS,
  y: WRAPPER_Y + RADIUS,
}

/**
 * 将点的运动限制在一个圆内
 */
const getPointInCircle = (center, r, x, y) => {
  let resultX = x;
  let resultY = y;

  let offsetX = x - center.x;
  let offsetY = y - center.y;

  let tan = Math.atan2(offsetY, offsetX);
  let maxX = Math.cos(tan) * r;
  let maxY = Math.sin(tan) * r;

  let degree = (360 + parseInt(convertRadian2Degree(tan))) % 360;

  if (Math.abs(offsetX) > Math.abs(maxX)) resultX = center.x + maxX;

  if (Math.abs(offsetY) > Math.abs(maxY)) resultY = center.y + maxY;

  return { resultX, resultY, degree, radian: convertDegree2Radian(degree) };
}

export default (props) => {
  const { eventDispatch = none, disabled } = props;
  const store = useStore({
    touchId: -1,  // 用于限制区域内不能进行多点触控
    tweener: null,
    currIdentifier: void 0,
    directionCount: 360,
    currentDegree: 0,
    directionDegree: 360 / 360,
    halfDirection: 360 / 360 / 2,
    button: null, // 按钮实例
  });

  const [btnPos, setBtnPos] = useState(CENTER);

  const handleDraw = useCallback((g) => {
    g.clear();
    g.beginFill(0x000000, 0.01);
    g.drawCircle(0, 0, JOYSTICKWIDTH / 2);
    g.endFill();
  }, []);

  const handleTouchStart = useCallback((evt) => {
    // 防止多点触控
    if (store.touchId !== -1) {
      return;
    }
    store.touchId === evt.touchId;

    if (store.tweener) {
      store.tweener.clear();
      store.tweener = null;
    }

    const { x, y } = evt.data.getLocalPosition(store.button.parent);

    const limit = getPointInCircle(CENTER, RADIUS - BUTTON_RADIUS, x, y);

    setBtnPos({
      x: limit.resultX,
      y: limit.resultY,
    });
  }, []);

  const handleTouchMove = useCallback((evt) => {
    /**
     * https://github.com/pixijs/pixi.js/issues/1979
     * PIXI的多点触控会依赖evt.data.identifier字段，所以每次开始接收move事件的时候
     * 缓存evt.data.identifier，后续的move事件只认该事件
     */
    if (store.currIdentifier !== undefined && evt.data.identifier !== store.currIdentifier) {
      return;
    }

    store.currIdentifier = evt.data.identifier;

    const { x, y } = evt.data.getLocalPosition(store.button.parent);

    const limit = getPointInCircle(CENTER, RADIUS - BUTTON_RADIUS, x, y);

    setBtnPos({
      x: limit.resultX,
      y: limit.resultY,
    });

    if (!disabled) {
      eventFilter(limit);
    }
  }, [disabled]);

  const handleTouchEnd = useCallback(() => {
    store.touchId = -1;
    store.currIdentifier = undefined;

    // 小圆点缓慢回到中心
    store.tweener = Tween.to(
      store.button,
      CENTER,
      250,
      'circOut',
    );

    if (!disabled) {
      eventDispatch && eventDispatch(-9999);
    }
  }, [disabled]);

  const eventFilter = useCallback((limit) => {
    let degree = limit.degree;
    let low = store.currentDegree - store.halfDirection;
    let high = store.currentDegree + store.halfDirection;

    if (degree >= low && degree < high) {
      return false;
    } else {
      store.currentDegree = parseInt(degree / store.directionDegree) * store.directionDegree;
      limit.radian = convertDegree2Radian(store.currentDegree);
      eventDispatch && eventDispatch(limit);
    }
  }, [eventDispatch]);

  return (
    <Container>
      <Sprite
        image="images/joystick_wrap.png"
        x={WRAPPER_X - 16}
        y={WRAPPER_Y - 6}
      />
      <Graphics
        name="wrap"
        position={CENTER}
        width={JOYSTICKWIDTH}
        height={JOYSTICKHEIGHT}
        draw={handleDraw}
        interactive={!disabled}
        touchstart={handleTouchStart}
        touchmove={handleTouchMove}
        touchend={handleTouchEnd}
        touchendoutside={handleTouchEnd}
      />
      <Button
        ref={ele => store.button = ele}
        image="images/joystick.png"
        width={50 * config.dpr}
        height={50 * config.dpr}
        position={btnPos}
      />
    </Container>
  );
}
