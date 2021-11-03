import '@/adapter/weapp-adapter/src/index';
import '@/adapter/pixi-adapter';

import React from 'react';
import { render, AppProvider } from '@inlet/react-pixi';
import GameEngine from '@/core/game-engine';

import Demo from '@/games/demo';

const gameEngine = new GameEngine();

const Game = () => {
  return (
    <AppProvider value={gameEngine}>
      <Demo />
    </AppProvider>
  );
}

render(<Game />, gameEngine.stage);