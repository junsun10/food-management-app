import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

import {useNavigation} from '@react-navigation/native';

import axios from 'axios';

const LoginScreen = ({setIsLoggedIn}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      // 서버에 보낼 데이터를 객체로 만듭니다.
      const requestData = {
        username: username,
        password: password,
      };

      // 개발을 위한 test 계정
      // const requestData = {
      // };

      // 실제 로그인을 검증하는 REST API 엔드포인트 URL로 설정합니다.
      const apiUrl = 'http://127.0.0.1:8000/auth/jwt/create';

      // POST 요청을 보냅니다.
      const response = await axios.post(apiUrl, requestData);

      // 서버에서 받은 응답을 확인하여 로그인 성공 여부를 판단합니다.
      if (response.status === 200) {
        // 로그인이 성공하면 setIsLoggedIn을 호출하여 상태를 변경합니다.
        const {access, refresh} = response.data;
        // AsyncStorage에 토큰을 저장합니다.
        await EncryptedStorage.setItem(
          'jwt_token',
          // JSON.stringify()를 사용하여 문자열로 변환합니다.
          JSON.stringify({
            access_token: access,
            refresh_token: refresh,
          }),
        );
        setIsLoggedIn(true);
      } else {
        console.log('Login failed'); // 로그인 실패 처리
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleSignup = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={text => setUsername(text)}
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
        <Button title="Login" onPress={handleLogin} />
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

export default LoginScreen;
