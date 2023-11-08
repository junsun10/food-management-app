import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';

import RecipeScreen from '../screens/RecipeScreen';
import SingleRecipeScreen from '../screens/SingleRecipeScreen';

const Stack = createStackNavigator();

const RecipeNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="레시피"
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
      <Stack.Screen name="레시피" component={RecipeScreen} />
      <Stack.Screen name="상세" component={SingleRecipeScreen} />
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
