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
import {useRoute} from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';

import OpenRecipeLink from '../components/OpenRecipeLink';

const SingleRecipeScreen = () => {
  const route = useRoute();
  const item = route.params.item;

  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        let jwt_token = await EncryptedStorage.getItem('jwt_token');
        jwt_token = JSON.parse(jwt_token);

        const apiUrl = 'http://127.0.0.1:8000/api/recipe/' + item.id;

        const headers = {
          Authorization: 'Bearer ' + jwt_token.access_token,
        };

        const response = await axios.get(apiUrl, {headers: headers});
        setRecipe(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecipe();
  }, []);

  const recipeIngredients = [];
  if (recipe) {
    for (let i = 0; i < recipe.recipe_ingredients.length; i++) {
      recipeIngredients.push(recipe.recipe_ingredients[i]);
    }
  }

  const renderItem = ({item}) => {
    //빈 항목인 경우 렌더링하지 않음
    if (item.title === '') {
      return (
        <TouchableOpacity style={[styles.box]}>
          <Text style={styles.text}></Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={[styles.box]}>
        <Text style={styles.text}>{item.ingredient.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {recipe ? (
        <View>
          <Text style={styles.title}>레시피</Text>
          <Text style={styles.title2}>{item.title}</Text>
          <Text style={styles.title}>재료</Text>
          <FlatList
            data={recipeIngredients}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
          />
          <OpenRecipeLink item={recipe.code} />
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
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

export default SingleRecipeScreen;
