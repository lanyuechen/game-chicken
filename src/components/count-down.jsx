import React, { useEffect, useState } from 'react';
import { Text } from '@inlet/react-pixi';
import { noop } from '@/utils/utils';

export default (props) =>{
  const { count: defaultCount, onComplete = noop, ...otherProps } = props;

  const [count, setCount] = useState(defaultCount);

  useEffect(() => {
    if (count > 0) {
      setTimeout(() => {
        setCount(count - 1);
      }, 1000);
    } else {
      onComplete();
    }
  }, [count]);

  if (count <= 0) {
    return null;
  }

  return (
    <Text
      text={`倒计时${count}秒`}
      {...otherProps}
    />
  )
}
