// src/screens/UserIngredientScreen.js
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

import axios from 'axios';
import Button from '../components/Button';

const UserIngredientScreen = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  const navigation = useNavigation();

  const fetchIngredients = async () => {
    try {
      let jwt_token = await EncryptedStorage.getItem('jwt_token');
      jwt_token = JSON.parse(jwt_token);

      const apiUrl = 'http://127.0.0.1:8000/api/user-ingredient';

      const headers = {
        Authorization: 'Bearer ' + jwt_token.access_token,
      };

      const response = await axios.get(apiUrl, {headers: headers});
      setUserIngredients(response.data);
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

  const navigateToAddIngredient = () => {
    navigation.navigate('식재료');
  };

  const navigateToSingleIngredient = item => {
    navigation.navigate('상세', {item: item});
  };

  const data = [];
  for (let i = 0; i < userIngredients.length; i++) {
    data.push({
      id: userIngredients[i].id,
      title: userIngredients[i].ingredient.title,
    });
  }

  const numColumns = 4; // 한 줄에 표시할 열 수
  const itemWidth = Dimensions.get('window').width / numColumns; // 항목의 너비를 화면 가로폭을 기반으로 계산

  // 빈 항목을 생성하여 각 줄에 동일한 수의 항목을 유지
  const addEmptyItems = (data, numColumns) => {
    const emptyItemCount = numColumns - (data.length % numColumns);
    if (emptyItemCount < numColumns) {
      for (let i = 0; i < emptyItemCount; i++) {
        data.push({id: `empty-${i}`, title: ''});
      }
    }
    return data;
  };

  addEmptyItems(data, numColumns);

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
      <TouchableOpacity
        style={[styles.box, {width: itemWidth}]}
        onPress={() => navigateToSingleIngredient(item)}>
        <Text style={styles.text}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>종류</Text>
      <FlatList
        data={data}
        numColumns={numColumns}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <Button title="+" onPress={navigateToAddIngredient} />
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
  box: {
    flex: 1,
    backgroundColor: 'lightgray',
    padding: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default UserIngredientScreen;
