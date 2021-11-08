import '@/adapter/weapp-adapter/src/index';
import '@/adapter/pixi-adapter';

import React from 'react';
import { render, AppProvider } from '@inlet/react-pixi';
import GameEngine from '@/core/game-engine';

import StateContext, { useGlobalStateEntry } from '@/utils/state';

import Demo from '@/games/demo';

const gameEngine = new GameEngine();

const Game = () => {
  const state = useGlobalStateEntry();

  return (
    <AppProvider value={gameEngine}>
      <StateContext.Provider value={state}>
        <Demo />
      </StateContext.Provider>
    </AppProvider>
  );
}

render(<Game />, gameEngine.stage);