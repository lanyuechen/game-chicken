import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { Container } from '@inlet/react-pixi';

import Prepare from './scenes/prepare';

export default () => {
  const planes = useState([
    { active: false },
    { active: false },
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
