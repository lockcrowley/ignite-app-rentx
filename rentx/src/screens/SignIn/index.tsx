import React, {useState} from 'react';
import {StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native';
import * as Yup from 'yup';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';
import theme from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

import {
 Container,
 Header,
 Title,
 Subtitle,
 Form,
 Footer,
} from './style';

export function SignIn(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();
  const { signIn } = useAuth();

  async function handleSignIn() {
    try{
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail valído'),
        password: Yup.string()
          .required('A senha é obrigatória')
      });
  
      await schema.validate({email, password });
      signIn({email, password});
    }catch(error) {
      if(error instanceof Yup.ValidationError){
        Alert.alert('Opa', error.message);
      }else{
        Alert.alert(
          'Erro na autenticação', 
          'Ocorreu um erro ao fazer login, verifique as credenciais'
        )
      }
    }
  }

  function handleNewAccount() {
    navigation.navigate('SignUpFirstStep');
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
          />
          <Header>
            <Title>
              Estamos {'\n'}
              quase lá
            </Title>
            <Subtitle>
              Faça seu login para começar {'\n'}
              uma experiência incrivel.
            </Subtitle>
          </Header>

          <Form>
            <Input
              icoName="mail"
              placeholder="E-mail"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={setEmail}
              value={email}
            />

            <PasswordInput
              icoName="lock"
              placeholder="Senha"
              onChangeText={setPassword}
              value={password}

            />
          </Form>
          
          <Footer>
            <Button
              title="Login"
              onPress={handleSignIn}
              enabled={true}
              loading={false}
            />
            <Button
              title="Criar conta gratuita"
              light
              onPress={handleNewAccount}
              enabled={true}
              loading={false}
              color={theme.colors.background_secondary}
            />
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}