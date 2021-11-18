import React, { useState, useRef } from 'react';
import { Container } from '@inlet/react-pixi';
import useStore from '@/utils/use-store';

import Rectangle from "./rectangle";

import config from '../config';

export default (props) => {
  const { draggable, onDragStart, onDrag, onDragEnd } = props;
  const [position, setPosition] = useState({x: 0, y: 0});
  const [alpha, setAlpha] = useState(1);
  const ref = useRef();
  const store = useStore();
  const matrix = useStore([
    [0, 0, 2, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
  ]);

  const draw = () => {
    this.removeChildren();
    this._matrix.forEach((m, i) => {
      m.forEach((k, j) => {
        if (k > 0) {
          this.addChild(new Rectangle(i, j, this.gridWidth, 0x0));
        }
      });
    });
  }

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
