import { useRef, useEffect } from 'react';
import { prepareSpec } from './utils';

export default (spec, deps) => {
  spec = prepareSpec(spec);

  const { accept, drop, hover } = spec;

  const dropTargetRef = useRef();
  const collectedProps = {};


  useEffect(() => {
    dropTargetRef.current.interactive = true;
    dropTargetRef.current.pointerover = handleHover;
    // dropTargetRef.current.pointerleave = handleDrop;
    dropTargetRef.current.pointerup = handleDrop;
  }, []);

  const handleDrop = () => {
    console.log('[drop]');
    drop && drop();
  }

  const handleHover = () => {
    console.log('[hover]');
    hover && hover();
  }

  return [
    collectedProps,
    dropTargetRef,
  ];
} 
