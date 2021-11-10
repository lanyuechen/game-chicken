import { useState, useContext, createContext, useCallback } from 'react';
import update from 'immutability-helper';

window.DATABUS = {
  players: [],
  bullets: [],
};

const StateContext = createContext([
  window.DATABUS,
  () => {},
]);

export const useDatabus = () => {
  const [state, setState] = useState(window.DATABUS);
  const updateState = useCallback((path, spec) => {
    if (typeof path === 'string') {
      path = path.split('.');
    }
    spec = path.reduceRight((p, k) => ({ [k]: p }), spec);
    window.DATABUS = update(window.DATABUS, spec);
    setState(window.DATABUS);
  }, []);
  return [state, updateState];
};

export const useDatabusUpdate = () => {
  const [, updateState] = useContext(StateContext);
  return updateState;
}

export default StateContext;
