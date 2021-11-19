import React from 'react';
import { Container } from '@inlet/react-pixi';
import useStore from '@/utils/use-store';
import Dnd from '@/components/dnd';

import Grid from '../base/grid';
import Plane from '../base/plane';
import config from '../config';

import { generateMatrix } from '../utils';

export default (props) => {
  const { planes } = props;
  const store = useStore();
  const board = useStore(generateMatrix(config.row, config.col));

  const isCollision = (plane) => {
    const r = plane.matrix.length;
    const c = plane.matrix[0].length;
    const gx = Math.floor(plane.x / plane.gridWidth);
    const gy = Math.floor(plane.y / plane.gridWidth);

    if (gx < 0 || gx + c >= config.col || gy < 0 || gy + r >= config.row) {
      return true;
    }

    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        if (plane.matrix[i][j] > 0 && board[gy + i][gx + j] > 0) {
          return true;
        }
      }
    }
    return false;
  }

  const setBoard = (plane, s) => {
    const gx = parseInt(plane.x / config.gridWidth);
    const gy = parseInt(plane.y / config.gridWidth);
    plane.matrix.forEach((m, i) => {
      m.forEach((k ,j) => {
        if (k > 0 && board[gy + i] && typeof board[gy + i][gx + j] !== undefined) {
          board[gy + i][gx + j] = s ? k : 0;
        }
      });
    });
  }

  const handleDragStart = (dnd, plane) => {
    store.originPosition = { x: dnd.x, y: dnd.y };
    setBoard({
      x: dnd.x,
      y: dnd.y,
      matrix: plane.matrix,
    }, false);
  }

  const handleDragEnd = (dnd, plane) => {
    const { x, y } = dnd;
    const gx = Math.round(x / config.gridWidth);
    const gy = Math.round(y / config.gridWidth);
    
    if (isCollision({
      x: dnd.x,
      y: dnd.y,
      matrix: plane.matrix,
    })) {
      dnd.x = store.originPosition.x;
      dnd.y = store.originPosition.y;
    } else {
      dnd.x = gx * config.gridWidth;
      dnd.y = gy * config.gridWidth;
    }

    setBoard({
      x: dnd.x,
      y: dnd.y,
      matrix: plane.matrix,
    }, true);
  }

  return (
    <Container>
      <Grid board={board} />
      {planes.map((plane, i) => (
        <Dnd
          key={i}
          defaultPosition={{
            x: 100,
            y: 100,
          }}
          onDragStart={(dnd) => handleDragStart(dnd, plane)}
          onDragEnd={(dnd) => handleDragEnd(dnd, plane)}
          draggable
        >
          <Plane key={i} matrix={plane.matrix} />
        </Dnd>
      ))}
    </Container>
  );
}
