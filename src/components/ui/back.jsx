import React from 'react';
import Button from '@/components/ui/button';

export default (props) => {
  const { onBack } = props;

  return (
    <Button
      image="images/goBack.png"
      x={104}
      y={68}
      onBack={onBack}
    />
  );
};
