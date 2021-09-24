import React from 'react';
import { ActivityIndicator } from 'react-native';
import theme from '../../styles/theme';
import { RectButtonProps } from 'react-native-gesture-handler';
import {
 Container ,
 Title
} from './style';

interface Props extends RectButtonProps{
  title: string;
  color?: string;
  loading?: boolean;
  light?: boolean;
}

export function Button({title, color, onPress, enabled = true, loading = false, light = false} : Props){
  return (
    <Container 
      onPress={onPress} 
      color={color} 
      enabled={enabled}
      style={{ opacity : (enabled === false || loading === true) ? .5 : 1}}
    >
      {loading
        ?<ActivityIndicator color={theme.colors.shape}/>
        :<Title light={light}>{title}</Title>
      }
    </Container>
  );
}