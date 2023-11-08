import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

import {useNavigation} from '@react-navigation/native';

import axios from 'axios';

const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const navigation = useNavigation();

  const handleSignup = async () => {
    try {
      // 서버에 보낼 데이터를 객체로 만듭니다.
      const requestData = {
        username: username,
        password: password,
        email: email,
      };

      // 실제 회원가입을 검증하는 REST API 엔드포인트 URL로 설정합니다.
      const apiUrl = 'http://127.0.0.1:8000/auth/users/';

      // POST 요청을 보냅니다.
      const response = await axios.post(apiUrl, requestData);

      // 서버에서 받은 응답을 확인하여 회원가입 성공 여부를 판단합니다.
      if (response.status === 201) {
        console.log('Sign up success');
        navigation.navigate('Login');
      } else {
        console.log('Sign up failed');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleBack = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup Screen</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={text => setUsername(text)}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.text}
      />
      <TextInput
        placeholder="Email"
        imputMode="email"
        value={email}
        onChangeText={text => setEmail(text)}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.text}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        style={styles.text}
      />
      <View style={styles.rowbox}>
        <Button title="Back" onPress={handleBack} />
        <Button title="Signup" onPress={handleSignup} />
      </View>
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
    marginTop: 16,
    borderWidth: 1,
    padding: 8,
    width: '40%',
  },
  rowbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SignupScreen;
