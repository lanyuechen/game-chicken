import { useRef, useEffect } from 'react';
import { prepareSpec } from './utils';

export default (spec, deps) => {
  spec = prepareSpec(spec);

  const dragSourceRef = useRef();
  const dragPreviewRef = useRef();
  const collectedProps = {};

  useEffect(() => {
    dragSourceRef.current.interactive = true;
    dragSourceRef.current.pointerdown = handleDragStart;
    dragSourceRef.current.pointerup = handleDragEnd;
    dragSourceRef.current.pointerupoutside = handleDragEnd;
    dragSourceRef.current.pointermove = handleDragMove;
  }, []);

  const handleDragMove = () => {
    if (dragSourceRef.current.dragging) {
      console.log('[drag move]');
      const { x, y } = dragSourceRef.current.data.getLocalPosition(dragSourceRef.current.parent);
      dragSourceRef.current.x = x - dragSourceRef.current.offset.x;
      dragSourceRef.current.y = y - dragSourceRef.current.offset.y;
    }
  }

  const handleDragStart = (event) => {
    console.log('[drag start]');
    dragSourceRef.current.dragging = true;
    dragSourceRef.current.data = event.data;
    dragSourceRef.current.offset = event.data.getLocalPosition(dragSourceRef.current);
  }

  const handleDragEnd = () => {
    console.log('[drag end]');
    if (dragSourceRef.current.dragging) {
      dragSourceRef.current.dragging = false;
      dragSourceRef.current.data = null;
      dragSourceRef.current.offset = null;
    }
  }

  if (typeof spec.collect === 'function') {
    Object.assign(collectedProps, spec.collect());
  }

  return [
    collectedProps,
    dragSourceRef,
    dragPreviewRef,
  ];
} 
