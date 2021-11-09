import { useState, useContext, createContext, useCallback } from 'react';
import update from 'immutability-helper';

let nextState = {
  players: [],
  bullets: [],
};

const StateContext = createContext([
  nextState,
  () => {},
]);

export const useGlobalStateEntry = () => {
  const [, setState] = useState(nextState);
  const updateState = useCallback((path, spec) => {
    if (typeof path === 'string') {
      path = path.split('.');
    }
    spec = path.reduceRight((p, k) => ({ [k]: p }), spec);
    nextState = update(nextState, spec);
    setState(nextState);
  }, []);
  return [nextState, updateState];
};

export const useGlobalState = () => {
  const [, updateState] = useContext(StateContext);
  return [nextState, updateState];
}

export default StateContext