import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { Container } from '@inlet/react-pixi';

import Prepare from './scenes/prepare';

export default () => {
  const [planes, setPlanes] = useState([
    {
      active: false,
      color: 0x0000ff,
      matrix: [
        [0, 0, 2, 0, 0],
        [1, 1, 1, 1, 1],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
      ]
    },
    {
      active: false,
      color: 0x00ff00,
      matrix: [
        [0, 0, 2, 0, 0],
        [1, 1, 1, 1, 1],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
      ]
    },
    {
      active: false,
      color: 0xff0000,
      matrix: [
        [0, 0, 2, 0, 0],
        [1, 1, 1, 1, 1],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
      ]
    },
  ]);
  
  return (
    <Container>
      <Routes>
        <Route path="/" element={<Navigate to="/prepare" replace />} />
        <Route
          path="/prepare"
          element={(
            <Prepare planes={planes} />
          )}
        />
      </Routes>
    </Container>
  )
}
