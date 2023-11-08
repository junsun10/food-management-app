import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';

import UserIngredientScreen from '../screens/UserIngredientScreen';
import IngredientScreen from '../screens/IngredientScreen';
import AddIngredientScreen from '../screens/AddIngredientScreen';
import SingleIngredientScreen from '../screens/SingleIngredientScreen';
import SinggeRecipeScreen from '../screens/SingleRecipeScreen';

const Stack = createStackNavigator();

const IngredientNavigtator = () => {
  return (
    <Stack.Navigator
      initialRouteName="홈"
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
      <Stack.Screen name="홈" component={UserIngredientScreen} />
      <Stack.Screen name="식재료" component={IngredientScreen} />
      <Stack.Screen name="추가" component={AddIngredientScreen} />
      <Stack.Screen name="상세" component={SingleIngredientScreen} />
      <Stack.Screen name="레시피" component={SinggeRecipeScreen} />
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

export default IngredientNavigtator;
