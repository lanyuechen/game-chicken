import React from 'react';
import { Container } from '@inlet/react-pixi';
import { useDrag, useDrop } from '@/components/dnd';

import Rectangle from '../base/rectangle';
import config from '../config';

export default (props) => {
  const [collected2, dropRef] = useDrop(() => ({
    accept: ['PLANE'],
    options: {

    },
    drop: (item, monitor) => {

    },
    hover: (item, monitor) => {

    },
  }), []);
  const [collected, dragRef] = useDrag(() => ({
    type: 'PLANE',
    item: {
      id: 'xxx'
    },
    previewOptions: {

    },
    options: {
      dropEffect: 'move' // move/copy
    },
    end: (item, monitor) => {

    },
    canDrag: (monitor) => {

    },
    isDragging: (monitor) => {

    },
    collect: (monitor, props) => ({

    })
  }), []);

  return (
    <Container x={config.margin} y={config.margin}>
      <Container ref={dropRef} x={100} y={0} width={200} height={200}>
        <Rectangle width={200} height={200} />
      </Container>
      <Container ref={dragRef}>
        <Rectangle width={50} height={50} />
      </Container>
    </Container>
  );
}

//  export default function Card({ isDragging, text }) {
//   const [{ opacity }, dragRef] = useDrag(
//     () => ({
//       type: ItemTypes.CARD,
//       item: { text },
//       collect: (monitor) => ({
//         opacity: monitor.isDragging() ? 0.5 : 1
//       })
//     }),
//     []
//   )
//   return (
//     <div ref={dragRef} style={{ opacity }}>
//       {text}
//     </div>
//   )
// }