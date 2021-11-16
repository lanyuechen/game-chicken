import React, { memo } from 'react';
import { Container, Graphics } from '@inlet/react-pixi';

export default memo((props) => {
  const { width, height, x, y, maxHp, hp } = props;

  const handleDraw = (g) => {
    g.clear();

    g.lineStyle(2, 6710886, 1);
    g.beginFill(14211288, 1);
    g.drawRoundedRect(0, 0, width, height, height / 2);

    g.lineStyle(2, 6710886, 1);
    g.beginFill(10002336, 1);
    g.drawRoundedRect(1, 1, width * (hp / maxHp), height - 2, (height - 2) / 2);
    g.endFill();
  }

  return (
    <Container x={x} y={y}>
      <Graphics draw={handleDraw} />
    </Container>
  )
});
