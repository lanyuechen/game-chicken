import React from 'react';
import { Container } from '@inlet/react-pixi';

import Rectangle from "./rectangle";

import config from '../config';

export default () => {
  const matrix = [
    [0, 0, 2, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
  ];

  return (
    <Container>
      {matrix.map((row, i) => row.map((col, j) => (
        <Rectangle
          key={`${i}-${j}`}
          x={j * config.gridWidth}
          y={i * config.gridWidth}
          width={config.gridWidth}
          height={config.gridWidth}
        />
      )))}
    </Container>
  )
}
