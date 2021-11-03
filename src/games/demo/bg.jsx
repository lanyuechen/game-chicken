import React, { useEffect, useState } from 'react';
import { Sprite } from '@inlet/react-pixi';

import config from '@/config';

export default (props) => {
  const { image } = props;

  const [size, setSize] = useState();

  useEffect(() => {
    const texture = PIXI.Texture.from(image);
    let { width, height } = texture;

    if (width / height > config.GAME_WIDTH / config.GAME_HEIGHT) {
      width = width * (config.GAME_HEIGHT / height);
      height = config.GAME_HEIGHT;
    } else {
      height = height * (config.GAME_WIDTH / width);
      width = config.GAME_WIDTH;
    }
    setSize([width, height]);
  }, [image]);

  if (!size) {
    return null;
  }

  return (
    <Sprite
      image={image}
      width={size[0]}
      height={size[1]}
    />
  );
}
