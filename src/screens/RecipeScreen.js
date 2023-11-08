// src/screens/RecipeScreen.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import EncryptedStorage from 'react-native-encrypted-storage';

import axios from 'axios';

const RecipeScreen = () => {
  const navigation = useNavigation();
  const [recipe, setRecipe] = useState([]);
  const [recipeCategory, setRecipeCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('굽기');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        let jwt_token = await EncryptedStorage.getItem('jwt_token');
        jwt_token = JSON.parse(jwt_token);

        const apiUrl = `http://127.0.0.1:8000/api/recipe?search=${selectedCategory}&page=1&page_size=10`;

        const headers = {
          Authorization: 'Bearer ' + jwt_token.access_token,
        };

        const response = await axios.get(apiUrl, {headers: headers});
        setRecipe(response.data.results);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecipes();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        let jwt_token = await EncryptedStorage.getItem('jwt_token');
        jwt_token = JSON.parse(jwt_token);

        const apiUrl = 'http://127.0.0.1:8000/api/recipe-category';

        const headers = {
          Authorization: 'Bearer ' + jwt_token.access_token,
        };

        const response = await axios.get(apiUrl, {headers: headers});
        setRecipeCategory(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategory();
  }, []);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleEndReached = () => {
    if (recipe.length % pageSize !== 0) {
      return;
    }
    const nextPage = page + 1;

    // API 요청을 보내서 다음 페이지의 데이터를 가져옴
    const fetchNextPage = async () => {
      try {
        let jwt_token = await EncryptedStorage.getItem('jwt_token');
        jwt_token = JSON.parse(jwt_token);

        const apiUrl = `http://127.0.0.1:8000/api/recipe?search=${selectedCategory}&page=${nextPage}&page_size=${pageSize}`;

        const headers = {
          Authorization: 'Bearer ' + jwt_token.access_token,
        };

        const response = await axios.get(apiUrl, {headers: headers});
        const newData = response.data.results;

        // 현재 데이터에 새로운 데이터를 추가하고 페이지 번호를 업데이트
        setRecipe([...recipe, ...newData]);
        setPage(nextPage);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNextPage();
  };

  const navigateToSingleRecipe = item => {
    navigation.navigate('상세', {item: item});
  };

  const numColumns = 1;
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
      <TouchableOpacity
        style={[styles.box, {width: itemWidth}]}
        onPress={() => navigateToSingleRecipe(item)}>
        <View>
          <Text style={styles.recipeTitle}>{item.title}</Text>
          <View style={styles.ingredientContainer}>
            {item.recipe_ingredients.map((item, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.ingredient} numberOfLines={3}>
                  {item.ingredient.title}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const categoryItemWidth = Dimensions.get('window').width / 4;
  // 카테고리 항목을 렌더링하는 함수
  const renderCategoryItem = ({item}) => (
    <TouchableOpacity
      style={[styles.categoryItem, {width: categoryItemWidth}]}
      onPress={() => setSelectedCategory(item.title)}>
      <Text style={styles.categoryText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>카테고리</Text>
        <FlatList
          data={recipeCategory}
          horizontal
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id.toString()}
          style={{
            maxHeight: Dimensions.get('window').height * 0.07,
            marginBottom: 10,
          }}
        />
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.title}>종류</Text>
        <FlatList
          data={recipe}
          numColumns={numColumns}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
        />
      </View>
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
    // alignItems: 'center',
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
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
  text: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  ingredientContainer: {
    flexDirection: 'row', // 재료를 가로로 배치
    flexWrap: 'wrap', // 넘치면 줄 바꿈
  },
  ingredientItem: {
    width: '33%', // 재료 항목을 반으로 나눔
    padding: 4, // 여백 조절
  },
  ingredient: {
    marginRight: 8, // 재료 사이에 간격 조절
  },
});

export default RecipeScreen;
