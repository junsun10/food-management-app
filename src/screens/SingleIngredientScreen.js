// src/screens/SingleIngredientScreen.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useNavigation, useNavitagion} from '@react-navigation/native';

import EncryptedStorage from 'react-native-encrypted-storage';

import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';

import axios from 'axios';
import Button from '../components/Button';

const SingleIngredientScreen = () => {
  const route = useRoute();
  const item = route.params.item;

  const [singleIngredient, setSingleIngredient] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [memo, setMemo] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        let jwt_token = await EncryptedStorage.getItem('jwt_token');
        jwt_token = JSON.parse(jwt_token);

        if (item) {
          const apiUrl = 'http://127.0.0.1:8000/api/user-ingredient/' + item.id;

          const headers = {
            Authorization: 'Bearer ' + jwt_token.access_token,
          };

          const response = await axios.get(apiUrl, {headers: headers});
          setSingleIngredient(response.data);
          setUpdatedQuantity(response.data.quantity);
          // console.log(singleIngredient);
          console.log(response.data);
          setStartDate(new Date(response.data.start));
          setEndDate(new Date(response.data.end));
          setMemo(response.data.memo);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchIngredient();
  }, [item]);

  const [ingredientRecipe, setIngredientRecipe] = useState(null);

  useEffect(() => {
    const fetchIngredientRecipe = async () => {
      try {
        let jwt_token = await EncryptedStorage.getItem('jwt_token');
        jwt_token = JSON.parse(jwt_token);

        if (item) {
          const apiUrl = `http://127.0.0.1:8000/api/ingredient-recipe?search=${item.title}&page=1&page_size=10`;

          const headers = {
            Authorization: 'Bearer ' + jwt_token.access_token,
          };

          const response = await axios.get(apiUrl, {headers: headers});
          setIngredientRecipe(response.data.results);
          // console.log(singleIngredient);
          // console.log(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchIngredientRecipe();
  }, [item]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleEndReached = () => {
    if (ingredientRecipe.length % pageSize !== 0) {
      return;
    }
    const nextPage = page + 1;

    // API 요청을 보내서 다음 페이지의 데이터를 가져옴
    const fetchNextPage = async () => {
      try {
        let jwt_token = await EncryptedStorage.getItem('jwt_token');
        jwt_token = JSON.parse(jwt_token);

        const apiUrl = `http://127.0.0.1:8000/api/ingredient-recipe?search=${item.title}&page=${nextPage}&page_size=${pageSize}`;

        const headers = {
          Authorization: 'Bearer ' + jwt_token.access_token,
        };

        const response = await axios.get(apiUrl, {headers: headers});
        const newData = response.data.results;

        // 현재 데이터에 새로운 데이터를 추가하고 페이지 번호를 업데이트
        setIngredientRecipe([...ingredientRecipe, ...newData]);
        setPage(nextPage);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNextPage();
  };

  const navigateToSingleRecipe = item => {
    navigation.navigate('레시피', {item: item});
  };

  const renderItem = ({item}) => {
    //빈 항목인 경우 렌더링하지 않음
    if (item.title === '') {
      return (
        <TouchableOpacity style={[styles.box]}>
          <Text style={styles.text}>{item.title}</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={[styles.box]}
        onPress={() => navigateToSingleRecipe(item.recipe)}>
        <Text style={styles.recipetext}>{item.recipe.title}</Text>
      </TouchableOpacity>
    );
  };

  const [updatedQuantity, setUpdatedQuantity] = useState(0);

  const handleQuantityChange = newQuantity => {
    setUpdatedQuantity(newQuantity);
  };

  const handleSave = async (newQuantity, startDate, endDate, memo) => {
    try {
      // API 호출을 위한 토큰 가져오기
      let jwt_token = await EncryptedStorage.getItem('jwt_token');
      jwt_token = JSON.parse(jwt_token);

      // console.log(item);
      // console.log(item.id);
      // API 업데이트 요청 생성
      const apiUrl = 'http://127.0.0.1:8000/api/user-ingredient/' + item.id;
      console.log(apiUrl);
      const headers = {
        Authorization: 'Bearer ' + jwt_token.access_token,
      };

      setUpdatedQuantity(newQuantity);

      // console.log(singleIngredient);

      const updatedData = {
        ingredient_id: singleIngredient.ingredient.id,
        quantity: newQuantity, // 수정된 개수 값
        start: startDate.toISOString().slice(0, 10), // 수정된 등록날짜 값
        end: endDate.toISOString().slice(0, 10), // 수정된 소비기한 값
        memo: memo, // 수정된 메모 값
      };

      // API 호출 및 업데이트
      const response = await axios.put(apiUrl, updatedData, {headers: headers});
      setSingleIngredient(response.data);

      // 업데이트 성공 시 사용자에게 피드백을 제공하거나 필요한 작업을 수행
      console.log('수정이 성공했습니다.');

      navigation.navigate('홈');
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      // API 호출을 위한 토큰 가져오기
      let jwt_token = await EncryptedStorage.getItem('jwt_token');
      jwt_token = JSON.parse(jwt_token);

      // API 업데이트 요청 생성
      const apiUrl = 'http://127.0.0.1:8000/api/user-ingredient/' + item.id;
      const headers = {
        Authorization: 'Bearer ' + jwt_token.access_token,
      };

      // API 호출 및 업데이트
      const response = await axios.delete(apiUrl, {headers: headers});

      // 삭제 성공 시 사용자에게 피드백을 제공하거나 필요한 작업을 수행
      console.log('삭제가 성공했습니다.');

      navigation.navigate('홈');
    } catch (error) {
      console.log(error);
    }
  };

  const formattedDate = date => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      {singleIngredient ? (
        <View style={{flex: 5}}>
          <Text style={styles.title}>{singleIngredient.ingredient.title}</Text>
          <Text style={styles.title}>
            카테고리: {singleIngredient.ingredient.category.title}
          </Text>
          <View style={styles.rowbox}>
            <Text style={styles.title}>개수</Text>
            <TextInput
              value={updatedQuantity} // 초기값을 문자열로 표시
              inputMode="decimal"
              onChangeText={text => handleQuantityChange(parseFloat(text))}
              style={styles.title}
            />
            {/* <Picker
              mode="dialog"
              style={{width: 100, backgroundColor: 'gray'}}
              selectedValue={singleIngredient.quantity}
              onValueChange={quantity => setUpdatedQuantity(quantity)}>
              <Picker.Item label="0" value={0} />
              <Picker.Item label="1" value={1} />
            </Picker> */}
          </View>
          <View style={styles.rowbox}>
            <Text style={styles.title}>등록날짜</Text>
            <TouchableOpacity onPress={() => setOpenStartDate(true)}>
              <Text style={styles.title}>{formattedDate(startDate)}</Text>
            </TouchableOpacity>
            <DatePicker
              modal
              mode="date"
              open={openStartDate}
              date={startDate}
              onConfirm={date => {
                setOpenStartDate(false);
                setStartDate(date);
              }}
              onCancel={() => {
                setOpenStartDate(false);
              }}
            />
          </View>
          <View style={styles.rowbox}>
            <Text style={styles.title}>소비기한</Text>
            <TouchableOpacity onPress={() => setOpenEndDate(true)}>
              <Text style={styles.title}>{formattedDate(endDate)}</Text>
            </TouchableOpacity>
            <DatePicker
              modal
              mode="date"
              open={openEndDate}
              date={endDate}
              onConfirm={date => {
                setOpenEndDate(false);
                setEndDate(date);
              }}
              onCancel={() => {
                setOpenEndDate(false);
              }}
            />
          </View>
          <View>
            <Text style={styles.title}>메모</Text>
            <View style={{backgroundColor: '#E5E3E3', margin: 5}}>
              <TextInput
                style={styles.memo}
                placeholder="메모를 입력하세요."
                value={memo}
                onChangeText={text => setMemo(text)}
                multiline={true}
              />
            </View>
          </View>
          <>
            <Text style={styles.title}>레시피</Text>
            <FlatList
              data={ingredientRecipe}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.1}
            />
          </>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
      <View style={styles.buttonbox}>
        <Button
          title="저장"
          onPress={() => handleSave(updatedQuantity, startDate, endDate, memo)}
        />
        <Button
          title="삭제"
          onPress={() => handleDelete(item.id)}
          backgroundColor={'red'}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonbox: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  recipetext: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  rowbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memobox: {
    backgroundColor: '#E5E3E3',
    margin: 5,
    padding: 5,
  },
  memo: {
    fontSize: 15,
    margin: 10,
  },
});

export default SingleIngredientScreen;
