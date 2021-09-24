import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components';
import { useNavigation, useRoute } from '@react-navigation/native';

import Animated, {useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, interpolate, Extrapolate} from 'react-native-reanimated';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Acessory } from '../../components/Acessory';
import { Button } from '../../components/Button';
import { CarDTO } from '../../dtos/CarDTO';

import { getAccessoryIcon } from '../../utils/getAccessoryIcon';

import {
 Container,
 Header,
 CarImages,
 Details,
 Description,
 Brand,
 Name,
 Rent,
 Period,
 Price,
 About,
 Accessories,
 Footer
} from './style';

interface Params{
  car: CarDTO
}

export function CarDetails(){
  const navigation = useNavigation();
  const route = useRoute();
  const { car } = route.params as Params;

  const theme = useTheme();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y
  });

  const headerStyleAnimation = useAnimatedStyle(() => {
    return{
      height: interpolate(
        scrollY.value,
        [0, 200],
        [200, 70],
        Extrapolate.CLAMP
      ),
    }
  });

  const sliderCarStyleAnimation = useAnimatedStyle(() => {
    return{
      opacity: interpolate(
        scrollY.value,
        [0, 150],
        [1, 0],
        Extrapolate.CLAMP,
      )
    }
  })

  function handleConfirmRental(){
    navigation.navigate('Scheduling', { car })
  }

  function handleBack(){
    navigation.goBack();
  }

  return (
    <Container>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <Animated.View 
        style={[
          headerStyleAnimation, 
          style.header,
          {backgroundColor: theme.colors.background_secondary}
        ]}>
        <Header>
          <BackButton onPress={handleBack}/>
        </Header>

        <Animated.View style={sliderCarStyleAnimation}>
          <CarImages>
            <ImageSlider imagesUrl={car.photos}/>
          </CarImages>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop:getStatusBarHeight() + 160,
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>

          <Rent>
            <Period>{car.period}</Period>
            <Price>R$ {car.price}</Price>
          </Rent>
        </Details>

        <Accessories>
          {
            car.accessories.map(accessory => (
              <Acessory 
                key={accessory.type}
                name={accessory.name} 
                icon={getAccessoryIcon(accessory.type)}
              />      
            ))      
          }
        </Accessories>

        <About>{car.about}</About>
      </Animated.ScrollView>

      <Footer>
        <Button title="Escolher período do aluguel" onPress={handleConfirmRental}/> 
      </Footer>

    </Container>
  );
}

const style = StyleSheet.create({
  header : {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 1,
  },
})