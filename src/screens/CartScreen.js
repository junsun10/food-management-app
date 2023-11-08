import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import EncryptedStorage from 'react-native-encrypted-storage';

import {useNavigation} from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';

import Button from '../components/Button';

import axios from 'axios';

const CartScreen = () => {
  const navigation = useNavigation();
  const [cart, setCart] = useState([]);

  const fetchIngredients = async () => {
    try {
      let jwt_token = await EncryptedStorage.getItem('jwt_token');
      jwt_token = JSON.parse(jwt_token);

      const apiUrl = 'http://127.0.0.1:8000/api/user-cart';

      const headers = {
        Authorization: 'Bearer ' + jwt_token.access_token,
      };

      const response = await axios.get(apiUrl, {headers: headers});
      setCart(response.data);
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // 이동할 때마다 데이터를 자동으로 가져오도록 설정
  useEffect(() => {
    const update = navigation.addListener('focus', () => {
      fetchIngredients();
    });

    return update;
  }, [navigation]);

  const navigateToAddCart = () => {
    navigation.navigate('추가');
  };

  const handleUpdate = async (item, newValue) => {
    try {
      let jwt_token = await EncryptedStorage.getItem('jwt_token');
      jwt_token = JSON.parse(jwt_token);

      const apiUrl = 'http://127.0.0.1:8000/api/user-cart/' + item.id;

      const headers = {
        Authorization: 'Bearer ' + jwt_token.access_token,
      };

      const body = {
        ingredient_id: item.ingredient.id,
        buy: newValue,
      };
      const response = await axios.put(apiUrl, body, {headers: headers});
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async id => {
    try {
      let jwt_token = await EncryptedStorage.getItem('jwt_token');
      jwt_token = JSON.parse(jwt_token);

      const apiUrl = 'http://127.0.0.1:8000/api/user-cart/' + id;

      const headers = {
        Authorization: 'Bearer ' + jwt_token.access_token,
      };

      const response = await axios.delete(apiUrl, {headers: headers});
      fetchIngredients();
    } catch (error) {
      console.log(error);
    }
  };

  const numColumns = 1; // 한 줄에 표시할 열 수
  const itemWidth = Dimensions.get('window').width / numColumns; // 항목의 너비를 화면 가로폭을 기반으로 계산

  const renderItem = ({item}) => {
    //빈 항목인 경우 렌더링하지 않음
    if (item.title === '') {
      return (
        <TouchableOpacity style={[styles.box, {width: itemWidth}]}>
          <Text style={styles.text}>{item.title}</Text>
        </TouchableOpacity>
      );
    }
    return (
      <View style={[styles.box]}>
        <Text style={styles.title}>{item.ingredient.title}</Text>
        <View style={styles.box2}>
          <CheckBox
            value={item.buy}
            boxType="square"
            onValueChange={newValue => {
              handleUpdate(item, newValue);
            }}
          />
          <TouchableOpacity
            onPress={() => {
              handleDelete(item.id);
            }}>
            <View style={styles.deleteBox}>
              <Text style={styles.title3}>삭제</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        numColumns={numColumns}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <Button title="+" onPress={navigateToAddCart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    margin: 10,
  },
  title2: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
  title3: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  box: {
    flex: 1,
    backgroundColor: 'lightgray',
    padding: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', // 재료를 가로로 배치
    flexWrap: 'wrap', // 넘치면 줄 바꿈
  },
  box2: {
    flex: 1,
    backgroundColor: 'lightgray',
    padding: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row', // 재료를 가로로 배치
    flexWrap: 'wrap', // 넘치면 줄 바꿈
  },
  deleteBox: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#9A9A9A',
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default CartScreen;
