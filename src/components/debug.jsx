import React, { useMemo } from 'react';
import { Container, Graphics, Text } from '@inlet/react-pixi';

import config from '@/config';

const DEBUGER_WIDTH = 465;
const DEBUGER_HEIGHT = 108;

const getTextHeight = (text, style) => {
  text = new PIXI.Text(text, style);
  const height = text.height;
  text.destroy();
  return height;
}

export default (props) => {
  const { msgs = [] } = props;

  const preparedMsgs = useMemo(() => {
    const textStyle = { fontSize: 22, fill: '#576B95' };
    const textHeight = getTextHeight('测试', textStyle);
    return msgs.map((msg, i) => {
      return {
        text: msg,
        style: textStyle,
        x: i % 2 === 0 ? 22 : 215,
        y: 24 + parseInt(i / 2) * (textHeight + 16)
      }
    });
  }, [msgs]);

  if (!preparedMsgs.length) {
    return null;
  }

  const handleDraw = (g) => {
    g.lineStyle(2, 0x576b95, 1);
    g.beginFill(0xd8d8d8, 0.7);
    g.drawRoundedRect(0, 0, DEBUGER_WIDTH, DEBUGER_HEIGHT, 18);
    g.endFill();
  }

  return (
    <Container
      x={(config.GAME_WIDTH - DEBUGER_WIDTH) / 2}
      y={config.GAME_HEIGHT - DEBUGER_HEIGHT - 52}
      width={DEBUGER_WIDTH}
      height={DEBUGER_HEIGHT}
    >
      <Graphics
        draw={handleDraw}
      />
      {preparedMsgs.map((msg, i) => (
        <Text key={i} text={msg.text} x={msg.x} y={msg.y} style={msg.style} />
      ))}
    </Container>
  );
}
