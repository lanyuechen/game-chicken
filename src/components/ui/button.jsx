import React, { forwardRef } from 'react';
import { Sprite, Text } from '@inlet/react-pixi';

export default forwardRef((props, ref) => {
  const { image, onClick, children, style, ...otherProps } = props;

  return (
    <Sprite
      ref={ref}
      image={image}
      anchor={0.5}
      interactive={typeof onClick === 'function'}
      pointertap={onClick}
      {...otherProps}
    >
      {children && (
        <Text text={children} anchor={0.5} style={style || { fontSize: 32 }} />
      )}
    </Sprite>
  );
});
