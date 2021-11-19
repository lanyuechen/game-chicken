import React from 'react';
import { Container } from '@inlet/react-pixi';

import Rectangle from "./rectangle";
import config from '../config';

export default (props) => {
  const { board } = props;

  return (
    <Container>
      {board.map((row, i) => row.map((col, j) => (
        <Rectangle
        key={`${i}-${j}`}
        color={0xdddddd}
        x={j * config.gridWidth}
        y={i * config.gridWidth}
        width={config.gridWidth}
        height={config.gridWidth}
      />
      )))}
    </Container>
  )
}
