import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, SafeAreaView, StatusBar} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import IngredientNavigator from './IngredientNavigator';
import RecipeNavigator from './RecipeNavigator';
import CartNavigator from './CartNavigator';

import SettingScreen from '../screens/SettingScreen';

const Tab = createMaterialBottomTabNavigator();

const MainNavigrator = ({setIsLoggedIn}) => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      shifting={true}
      activeColor="#5915AB"
      inactiveColor="black"
      barStyle={{
        backgroundColor: 'white',
        height: 65,
        marginBottom: 20,
      }}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Add') {
            iconName = focused ? 'plus' : 'plus-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Recipe') {
            iconName = focused ? 'book-open' : 'book-open-outline';
          } else if (route.name === 'Setting') {
            iconName = focused ? 'cog' : 'cog-outline';
          }

          return <Icon name={iconName} size={24} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={IngredientNavigator} />
      <Tab.Screen name="Cart" component={CartNavigator} />
      <Tab.Screen name="Recipe" component={RecipeNavigator} />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        initialParams={{setIsLoggedIn: setIsLoggedIn}}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({});

export default MainNavigrator;
