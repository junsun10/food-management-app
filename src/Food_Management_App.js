import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, SafeAreaView, StatusBar} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import {Provider, DefaultTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

// import LoginScreen from './screens/LoginScreen';
// import IngredientScreen from './screens/IngredientScreen';
// import UserIngredientScreen from './screens/UserIngredientScreen';
// import AddIngredientScreen from './screens/AddIngredientScreen';
// import CartScreen from './screens/CartScreen';
// import RecipeScreen from './screens/RecipeScreen';
// import SettingScreen from './screens/SettingScreen';

import MainNavigator from './navigators/MainNavigator';
import AuthenticationNavigator from './navigators/AuthenticationNavigator';

const Tab = createMaterialBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    secondaryContainer: 'transparent',
  },
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        let jwt_token = await EncryptedStorage.getItem('jwt_token');
        jwt_token = JSON.parse(jwt_token);

        if (jwt_token) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  return (
    <Provider theme={theme}>
      {/* <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}> */}
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <NavigationContainer>
          {isLoggedIn ? (
            <MainNavigator setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <AuthenticationNavigator setIsLoggedIn={setIsLoggedIn} />
          )}
        </NavigationContainer>
        {/* </SafeAreaView> */}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
  },
});

export default App;
