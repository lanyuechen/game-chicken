import React, { useEffect, useRef } from 'react';
import { Container } from '@inlet/react-pixi';

export default (props) => {
  const { x, y, draggable, onDragStart, onDrag, onDragEnd, children } = props;
  const ref = useRef();

  const current = ref.current;

  useEffect(() => {
    current.x = x;
    current.y = y;
  }, []);


  const handleDragMove = () => {
    if (current.dragging) {
      const { x, y } = current.data.getLocalPosition(current.parent);
      current.x = x - current.offset.x;
      current.y = y - current.offset.y;
      onDrag && onDrag(current);
    }
  }

  const handleDragStart = (event) => {
    current.dragging = true;
    current.data = event.data;
    current.offset = event.data.getLocalPosition(current);
    current.originPosition = { x: current.x, y: current.y };
    onDragStart && onDragStart(current);
  }

  const handleDragEnd = () => {
    if (current.dragging) {
      current.dragging = false;
      onDragEnd && onDragEnd(current);
      current.data = null;
      current.offset = null;
      current.originPosition = null;
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
