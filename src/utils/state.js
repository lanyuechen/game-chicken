import { useState, useContext, createContext, useCallback } from 'react';
import update from 'immutability-helper';

const G = {};

G.nextState = {
  players: [],
  bullets: [],
};

const StateContext = createContext([
  G.nextState,
  () => {},
]);

export const useGlobalStateEntry = () => {
  const [, setState] = useState(G.nextState);
  const updateState = useCallback((path, spec) => {
    if (typeof path === 'string') {
      path = path.split('.');
    }
    // const key = path.shift();
    spec = path.reduceRight((p, k) => ({ [k]: p }), spec);
    G.nextState = update(G.nextState, spec);
    setState(G.nextState);
  }, []);
  return [G.nextState, updateState];
};

export const useGlobalState = () => {
  const [, updateState] = useContext(StateContext);
  return [G.nextState, updateState];
}

export default StateContext;
