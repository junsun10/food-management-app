// src/screens/RecipeScreen.js
import React, {useState, useEffect} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

const SettingScreen = ({navigation, route}) => {
  const handleLogout = async () => {
    try {
      await EncryptedStorage.removeItem('jwt_token');
      route.params.setIsLoggedIn(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
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

export default SettingScreen;
