import React from 'react';
import { AnimatedSprite } from '@inlet/react-pixi';

export default (props) => {
  const { x, y, width, height, rotation } = props;

  return (
    <AnimatedSprite
      images={['images/aircraft1.png', 'images/aircraft2.png']}
      animationSpeed={0.17}
      anchor={0.5}
      x={x}
      y={y}
      width={width}
      height={height}
      rotation={rotation}
      isPlaying
    />
  );
};
