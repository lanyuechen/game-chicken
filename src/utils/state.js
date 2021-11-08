import { useState, useContext, createContext } from 'react';
import update from 'immutability-helper';

const defaultValue = {
  players: [],
  bullets: [],
};

const StateContext = createContext(defaultValue);

export const useGlobalStateEntry = () => {
  const [state, setState] = useState([
    defaultValue,
    (path, spec) => {
      if (typeof path === 'string') {
        path = path.split('.');
      }
      path = [0, ...path];
      spec = path.reduceRight((p, k) => ({ [k]: p }), spec);
      setState(s => update(s, spec));
    }
  ]);
  return state;
};

export const useGlobalState = () => {
  const [state, updateState] = useContext(StateContext);
  return [state, updateState];
}

export default StateContext