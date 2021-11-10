import React from 'react';
import { Sprite } from '@inlet/react-pixi';

export default (props) => {
  const { x, y, width, height, rotation } = props;

  return (
    <Sprite
      image="images/bullet_blue.png"
      x={x}
      y={y}
      width={width}
      height={height}
      rotation={rotation}
      anchor={0.5}
    />
  );
};
