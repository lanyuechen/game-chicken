import React, { useCallback, useState } from 'react';
import { Graphics } from '@inlet/react-pixi';

export default (props) => {
  const { color, x, y, width, height } = props;
  const [active, setActive] = useState(false);

  const draw = useCallback((g) => {
    g.clear();
    g.lineStyle(2, color);
    g.beginFill(color, active ? 0.2 : 0.05);
    g.drawRect(0, 0, width, height);
    g.endFill();
  }, [color, width, height, active]);

  return (
    <Graphics
      x={x}
      y={y}
      draw={draw}
      pointerdown={() => setActive(true)}
      pointerup={() => setActive(false)}
      pointerupoutside={() => setActive(false)}
    />
  );
}
