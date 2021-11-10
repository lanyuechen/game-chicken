import '@/adapter/weapp-adapter/src/index';
import '@/adapter/pixi-adapter';

import React from 'react';
import { render, AppProvider } from '@inlet/react-pixi';
import GameEngine from '@/core/game-engine';

import DatabusContext, { useDatabus } from '@/utils/databus';

import Demo from '@/games/demo';

const gameEngine = new GameEngine();

const Game = () => {
  const state = useDatabus();

  return (
    <AppProvider value={gameEngine}>
      <DatabusContext.Provider value={state}>
        <Demo />
      </DatabusContext.Provider>
    </AppProvider>
  );
}

render(<Game />, gameEngine.stage);