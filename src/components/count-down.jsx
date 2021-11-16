import React, { useEffect, useState } from 'react';
import { Text } from '@inlet/react-pixi';
import { noop } from '@/utils/utils';

export default (props) =>{
  const { count: defaultCount, onComplete = noop, ...otherProps } = props;

  const [count, setCount] = useState(defaultCount);

  useEffect(() => {
    let timeout;
    if (count > 0) {
      timeout = setTimeout(() => {
        setCount(count => count - 1);
      }, 1000);
    } else {
      onComplete();
    }
    return () => {
      clearTimeout(timeout);
    }
  }, []);

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
