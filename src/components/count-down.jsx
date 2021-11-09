import React, { useEffect, useState } from 'react';
import { Text } from '@inlet/react-pixi';

export default (props) =>{
  const { count: defaultCount, ...otherProps } = props;

  const [count, setCount] = useState(defaultCount);

  useEffect(() => {
    if (count > 0) {
      setTimeout(() => {
        setCount(count - 1);
      }, 1000);
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
