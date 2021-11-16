import { useEffect } from 'react';
import gameServer from '@/core/game-server';

export const updateHook = (key) => (cb) => {
  useEffect(() => {
    gameServer.event.on(key, cb);
    return () => {
      gameServer.event.off(key, cb);
    }
  }, []);
}

export const useRenderUpdate = updateHook('renderUpdate');
export const useFrameUpdate = updateHook('frameUpdate');
export const usePreditUpdate = updateHook('preditUpdate');