import React, { useEffect, useRef } from 'react';
import { Container } from '@inlet/react-pixi';

export default (props) => {
  const { defaultPosition = {}, draggable, onDragStart, onDrag, onDragEnd, children } = props;
  const ref = useRef();

  useEffect(() => {
    ref.current.x = defaultPosition.x || 0;
    ref.current.y = defaultPosition.y || 0;
  }, []);


  const handleDragMove = () => {
    if (ref.current.dragging) {
      console.log('[drag move]');
      const { x, y } = ref.current.data.getLocalPosition(ref.current.parent);
      ref.current.x = x - ref.current.offset.x;
      ref.current.y = y - ref.current.offset.y;
      onDrag && onDrag();
    }
  }

  const handleDragStart = (event) => {
    console.log('[drag start]');
    ref.current.dragging = true;
    ref.current.data = event.data;
    ref.current.offset = event.data.getLocalPosition(ref.current);
    onDragStart && onDragStart(ref.current);
  }

  const handleDragEnd = () => {
    console.log('[drag end]');
    if (ref.current.dragging) {
      ref.current.dragging = false;
      onDragEnd && onDragEnd(ref.current);
      ref.current.data = null;
      ref.current.offset = null;
    }
  }

  return (
    <Container
      ref={ref}
      interactive={draggable}
      buttonMode
      pointerdown={handleDragStart}
      pointerup={handleDragEnd}
      pointerupoutside={handleDragEnd}
      pointermove={handleDragMove}
    >
      {children}
    </Container>
  )
}
