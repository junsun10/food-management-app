import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const Stack = createStackNavigator();

const AuthenticationNavigator = ({setIsLoggedIn}) => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
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
      {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
      <Stack.Screen name="Login">
        {props => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen name="SignUp" component={SignupScreen} />
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

export default AuthenticationNavigator;
