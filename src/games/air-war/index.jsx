import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { Container } from '@inlet/react-pixi';

import Prepare from './scenes/prepare';

export default () => {
  const [planes, setPlanes] = useState([
    {
      active: false,
      matrix: [
        [0, 0, 2, 0, 0],
        [1, 1, 1, 1, 1],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
      ]
    },
    {
      active: false,
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
