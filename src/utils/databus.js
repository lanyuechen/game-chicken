import { useState, useContext, createContext, useCallback } from 'react';
import update from 'immutability-helper';

let databus = {
  players: [],
  bullets: [],
};

const DatabusContext = createContext([
  databus,
  () => {},
]);

export const useDatabus = () => {
  const [state, setState] = useState(databus);
  const updateState = useCallback((path, spec) => {
    if (typeof path === 'string') {
      path = path.split('.');
    }
    spec = path.reduceRight((p, k) => ({ [k]: p }), spec);
    databus = update(databus, spec);
    setState(databus);
  }, []);
  return [state, updateState];
};

export const useUpdate = () => {
  const [, updateState] = useContext(DatabusContext);
  return updateState;
}

export {
  databus
}

export default DatabusContext;