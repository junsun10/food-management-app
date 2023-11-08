import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';

import CartScreen from '../screens/CartScreen';
import AddCartScreen from '../screens/AddCartScreen';

const Stack = createStackNavigator();

const RecipeNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="장바구니"
      screenOptions={{
        headerMode: 'screen',
        headerTintColor: 'black',
        headerLeftContainerStyle: {
          paddingBottom: 10,
        },
        headerTitleStyle: {
          paddingBottom: 10,
        },
        headerStyle: {
          backgroundColor: 'white',
          height: 85,
        },
      }}>
      <Stack.Screen name="장바구니" component={CartScreen} />
      <Stack.Screen name="추가" component={AddCartScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
  },
});

export default RecipeNavigator;
