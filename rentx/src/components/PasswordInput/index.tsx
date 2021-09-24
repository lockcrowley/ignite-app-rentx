import React, {useState} from 'react';
import { TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components';
import { BorderlessButton } from 'react-native-gesture-handler';

import {
 Container,
 IconContainer,
 InputText,
} from './style';

interface InputProps extends TextInputProps{
  icoName: React.ComponentProps<typeof Feather>['name']
  value?: string;
}

export function PasswordInput({icoName, value, ...rest} : InputProps){
  const [isPassVisible, setIsPassVisible] = useState(true)
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const theme = useTheme();

  function handleInputFocus() {
    setIsFocused(true);
  }

  function handleInputBlur() {
    setIsFocused(false);
    setIsFilled(!!value);
  }

  function handlePassVisibilityChange(){ 
    setIsPassVisible(prevState => !prevState);
  }

  return (
    <Container>
      <IconContainer isFocused={isFocused}>
        <Feather
          name={icoName}
          size={24}
          color={(isFocused || isFilled) ? theme.colors.main : theme.colors.text_detail}
        />
      </IconContainer>

    <InputText 
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
      secureTextEntry={isPassVisible}
      autoCorrect={false}
      isFocused={isFocused}
      {...rest}
    />

    <BorderlessButton onPress={handlePassVisibilityChange}>
      <IconContainer isFocused={isFocused}>
        <Feather
          name={isPassVisible ? 'eye' : 'eye-off'}
          size={24}
          color={theme.colors.text_detail}
        />
      </IconContainer>
    </BorderlessButton>

    </Container>
  );
}