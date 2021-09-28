import React, {useState} from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';
import * as Yup from 'yup';
import { useNetInfo } from '@react-native-community/netinfo';

import { useTheme } from 'styled-components';
import { useAuth } from '../../hooks/auth';
import {Feather} from '@expo/vector-icons';

import { BackButton } from '../../components/BackButton';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';
import { Button } from '../../components/Button';

import {
 Container,
 Header,
 HeaderTop,
 HeaderTitle,
 LogoutButton,
 PhotoContainer,
 Photo,
 PhotoButton,
 Content,
 Options,
 Option,
 OptionTitle,
 Section
} from './style';

export function Profile(){
  const {user, signOut, updatedUser} = useAuth();

  const [option, setOption] = useState<'dataEdit' | 'passwordEdit'>('dataEdit');
  const [avatar, setAvatar] = useState(user.avatar);
  const [name, setName] = useState(user.name);
  const [driveLicense, setDriveLicense] = useState(user.driver_license);

  const theme = useTheme();
  const navigation = useNavigation();
  const netInfo = useNetInfo();

  function handleBack(){
    navigation.goBack();
  }

  function handleOptionChange(optionSelected: 'dataEdit' | 'passwordEdit'){
    if(netInfo.isConnected === false && optionSelected === 'passwordEdit'){
      Alert.alert('Você está Offline', 'Para mudar a senha, conecte-se a internet')
    }else{
      setOption(optionSelected);
    }
  }

  async function handleChangeAvatar() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,4],
      quality: 1,
    });

    if(result.cancelled){
      return;
    }

    if(result.uri){
      setAvatar(result.uri);
    }
  }

  async function handleProfileUpdate() {
    try{
      const schema = Yup.object().shape({
        driveLicense: Yup.string()
        .required('CNH é obrigatória'),
        name: Yup.string()
        .required('Nome é obrigatório')
      });

      const data = {name, driveLicense};
      await schema.validate(data);
      
      await updatedUser({
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        name,
        driver_license: driveLicense,
        avatar,
        token: user.token
      });

      Alert.alert('Perfil atualizado!');
      
    }catch(error){
      if(error instanceof Yup.ValidationError){
        Alert.alert('Opa', error.message);
      }else{
        Alert.alert('Não foi possível atualizar o perfil')
      }
    }
  }

  async function handleSignOut() {
    Alert.alert(
      'Tem certeza?', 
      'Se você sair, irá precisar de internet para conectar-se novamente',

      [
        {
          text: 'Cancelar',
          onPress: () => {},
          
        },
        {
          text: 'Sair',
          onPress: () => signOut()
        }
      ]
    );
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <HeaderTop>
              <BackButton  
                color={theme.colors.shape} 
                onPress={handleBack}
              />
              <HeaderTitle>Editar Perfil</HeaderTitle> 
              <LogoutButton onPress={handleSignOut}>
                <Feather 
                  name="power" 
                  size={24} 
                  color={theme.colors.shape}
                />
              </LogoutButton>
            </HeaderTop>

            <PhotoContainer>
             { !!avatar && <Photo source={{ uri: avatar}}/>}
              <PhotoButton onPress={handleChangeAvatar}>
                <Feather
                  name="camera"
                  size={24}
                  color={theme.colors.shape}
                />
              </PhotoButton>
            </PhotoContainer>
          </Header>
          
          <Content  style={{marginBottom: useBottomTabBarHeight()}}>
            <Options>
              <Option 
                active={option === 'dataEdit'}
                onPress={() => handleOptionChange('dataEdit')}
              >
                <OptionTitle active={option === 'dataEdit'}>
                  Dados
                </OptionTitle>
              </Option>

              <Option 
                active={option === 'passwordEdit'}
                onPress={() => handleOptionChange('passwordEdit')}
              >
                <OptionTitle active={option === 'passwordEdit'}>
                  Trocar Senha
                </OptionTitle>
              </Option>
            </Options>
            {
              option === 'dataEdit' 
              ? 
              <Section>
                <Input
                  icoName="user"
                  placeholder="Nome"
                  autoCorrect={false}
                  defaultValue={user.name}
                  onChangeText={setName}
                />    
                <Input
                  icoName="user"
                  editable={false}
                  defaultValue={user.email}
                />
                <Input
                  icoName="credit-card"
                  placeholder="CNH"
                  keyboardType="numeric"
                  defaultValue={user.driver_license}
                  onChangeText={setDriveLicense}
                />  
              </Section>
              :
              <Section>
                <PasswordInput
                  icoName="lock"
                  placeholder="Senha Atual"
                />    
                <PasswordInput
                  icoName="lock"
                  placeholder="Nova Senha"
                />
                <PasswordInput
                  icoName="lock"
                  placeholder="Repetir Senha"
                />  
              </Section>
            }  

            <Button
              title="Salvar alterações"
              onPress={handleProfileUpdate}
            />
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}