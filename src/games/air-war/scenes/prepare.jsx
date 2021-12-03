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
    const gx = Math.round(plane.x / config.gridWidth);
    const gy = Math.round(plane.y / config.gridWidth);

    if (gx < 0 || gx + c > config.col || gy < 0 || gy + r > config.row) {
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

  const setBoard = (plane) => {
    const r = plane.matrix.length;
    const c = plane.matrix[0].length;
    const gx = parseInt(plane.x / config.gridWidth);
    const gy = parseInt(plane.y / config.gridWidth);
    if (gx < 0 || gx + c > config.col || gy < 0 || gy + r > config.row) {
      return true;
    }
    plane.matrix.forEach((m, i) => {
      m.forEach((k ,j) => {
        if (k) {
          board[gy + i][gx + j] = k;
        }
      });
    });
  }

  const unsetBoard = (plane) => {
    const r = plane.matrix.length;
    const c = plane.matrix[0].length;
    const gx = parseInt(plane.x / config.gridWidth);
    const gy = parseInt(plane.y / config.gridWidth);
    if (gx < 0 || gx + c > config.col || gy < 0 || gy + r > config.row) {
      return;
    }
    plane.matrix.forEach((m, i) => {
      m.forEach((k ,j) => {
        if (k && board[gy + i]?.[gx + j]) {
          board[gy + i][gx + j] = 0;
        }
      });
    });
  }

  const handleDragStart = (dnd, plane) => {
    store.originPosition = { x: dnd.x, y: dnd.y };
    unsetBoard({
      x: dnd.x,
      y: dnd.y,
      matrix: plane.matrix,
    });
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
    });
  }

  return (
    <Container x={config.margin} y={config.margin}>
      <Grid board={board} />
      {planes.map((plane, i) => (
        <Dnd
          key={i}
          defaultPosition={{
            x: config.gridWidth * config.col + config.margin * 2,
            y: 100,
          }}
          onDragStart={(dnd) => handleDragStart(dnd, plane)}
          onDragEnd={(dnd) => handleDragEnd(dnd, plane)}
          draggable
        >
          <Plane matrix={plane.matrix} color={plane.color} />
        </Dnd>
      ))}
    </Container>
  );
}
