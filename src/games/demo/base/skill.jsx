import React, { useState } from 'react';
import { Sprite } from '@inlet/react-pixi';

import config from '@/config.js';

export default (props) => {
  const { disabled, eventDispatch } = props;
  const [active, setActive] = useState(false);

  return (
    <Sprite
      image={active ? 'images/attacking.png' : 'images/attack.png'}
      x={config.GAME_WIDTH - 60 * config.dpr - 50 * config.dpr}
      y={config.GAME_HEIGHT - 60 * config.dpr - 70 * config.dpr}
      width={60 * config.dpr}
      height={60 * config.dpr}
      interactive={!disabled}
      pointerdown={() => {
        setActive(true);
        if (!disabled) {
          eventDispatch && eventDispatch();
        }
      }}
      pointerup={() => setActive(false)}
      pointerout={() => setActive(false)}
    />
  );
}
