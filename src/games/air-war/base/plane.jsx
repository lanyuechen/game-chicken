import React from 'react';
import { Container } from '@inlet/react-pixi';

import Rectangle from "./rectangle";

import config from '../config';

export default (props) => {
  const { matrix } = props;

  return (
    <Container>
      {matrix.map((row, i) => row.map((col, j) => {
        if (!col) {
          return null;
        }
        return (
          <Rectangle
            key={`${i}-${j}`}
            x={j * config.gridWidth}
            y={i * config.gridWidth}
            width={config.gridWidth}
            height={config.gridWidth}
          />
        );
      }))}
    </Container>
  )
}
