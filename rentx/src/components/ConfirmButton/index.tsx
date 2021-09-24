import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import {
 Container,
 Title
} from './style';

interface Props extends RectButtonProps {
  title: string;
  onPress: () => void;
}

export function ConfirmButton({title, onPress}: Props){
  return (
    <Container onPress={onPress}>
      <Title>{title}</Title>
    </Container>
  );
}