import React from 'react';
import { Container } from '@inlet/react-pixi';
import useStore from '@/utils/use-store';
import Dnd from '@/components/dnd';

import Grid from './grid';
import Plane from './plane';
import config from '../config';

import { generateMatrix } from './utils';

export default (props) => {
  const { planes } = props;

  const board = useStore(generateMatrix(config.row, config.col));

  const setBoard = (plane, s) => {
    const gx = parseInt(plane.x / config.gridWidth);
    const gy = parseInt(plane.y / config.gridWidth);
    plane._matrix.forEach((m, i) => {
      m.forEach((k ,j) => {
        if (k > 0 && board[gy + i] && typeof board[gy + i][gx + j] !== undefined) {
          board[gy + i][gx + j] = s ? k : 0;
        }
      });
    });
  }

  const isCollision = (plane) => {
    const r = plane._matrix.length;
    const c = plane._matrix[0].length;
    const gx = Math.floor(plane.x / plane.gridWidth);
    const gy = Math.floor(plane.y / plane.gridWidth);

    if (gx < 0 || gx + c >= config.col || gy < 0 || gy + r >= config.row) {
      return true;
    }

    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        if (plane._matrix[i][j] > 0 && board[gy + i][gx + j] > 0) {
          return true;
        }
      }
    }
    return false;
  }

  const handleDragStart = (plane) => {
    setBoard(plane, false);
  }

  const handleDragEnd = (plane) => {
    const { x, y, originPosition } = plane;
    const gx = Math.round(x / config.gridWidth);
    const gy = Math.round(y / config.gridWidth);
    
    if (isCollision(plane)) {
      plane.x = originPosition.x;
      plane.y = originPosition.y;
    } else {
      plane.x = gx * config.gridWidth;
      plane.y = gy * config.gridWidth;
    }

    setBoard(plane, true);
  }

  return (
    <Container>
      <Grid />
      {planes.map((plane, i) => (
        <Dnd
          key={i}
          x={100}
          y={100}
          onDragStart={(plane) => handleDragStart(plane)}
          onDragEnd={(plane) => handleDragEnd(plane)}
          draggable
        >
          <Plane />
        </Dnd>
      ))}
    </Container>
  );
}
