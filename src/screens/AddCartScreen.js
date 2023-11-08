// src/screens/AddIngredientScreen.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';

const AddCartScreen = () => {
  const navigation = useNavigation();
  const [ingredients, setIngredients] = useState([]);
  const [ingredientCategory, setIngredientCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('견과류');

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        let jwt_token = await EncryptedStorage.getItem('jwt_token');
        jwt_token = JSON.parse(jwt_token);

        const apiUrl =
          'http://127.0.0.1:8000/api/ingredient?search=' + selectedCategory;

        const headers = {
          Authorization: 'Bearer ' + jwt_token.access_token,
        };

        const response = await axios.get(apiUrl, {headers: headers});
        setIngredients(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchIngredients();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        let jwt_token = await EncryptedStorage.getItem('jwt_token');
        jwt_token = JSON.parse(jwt_token);

        const apiUrl = 'http://127.0.0.1:8000/api/ingredient-category';

        const headers = {
          Authorization: 'Bearer ' + jwt_token.access_token,
        };

        const response = await axios.get(apiUrl, {headers: headers});
        setIngredientCategory(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategory();
  }, []);

  const handleAddCart = async item => {
    try {
      let jwt_token = await EncryptedStorage.getItem('jwt_token');
      jwt_token = JSON.parse(jwt_token);

      const apiUrl = 'http://127.0.0.1:8000/api/user-cart';

      const headers = {
        Authorization: 'Bearer ' + jwt_token.access_token,
      };

      const data = {
        ingredient_id: item.id,
      };
      const response = await axios.post(apiUrl, data, {headers: headers});
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    navigation.navigate('장바구니');
  };

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

  // 각 항목을 렌더링하는 함수
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
        onPress={() => handleAddCart(item)}>
        <Text style={styles.text}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  // 빈 항목 추가
  addEmptyItems(ingredients, numColumns);

  // 카테고리 항목을 렌더링하는 함수
  const renderCategoryItem = ({item}) => (
    <TouchableOpacity
      style={[styles.categoryItem, {width: itemWidth}]}
      onPress={() => setSelectedCategory(item.title)}>
      <Text style={styles.categoryText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>카테고리</Text>
      <FlatList
        data={ingredientCategory}
        horizontal
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id.toString()}
        style={{
          maxHeight: Dimensions.get('window').height * 0.07,
          marginBottom: 10,
        }}
      />
      <Text style={styles.title}>재료</Text>
      <FlatList
        data={ingredients}
        numColumns={numColumns}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
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
  categoryItem: {
    backgroundColor: 'lightblue',
    height: Dimensions.get('window').height * 0.07,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingBottom: 10,
    paddingTop: 5,
  },
});

export default AddCartScreen;
