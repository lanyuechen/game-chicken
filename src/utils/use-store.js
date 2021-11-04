import { useRef } from 'react';

export default (defaultValue = {}) => {
  const ref = useRef(defaultValue);
  return ref.current;
}