// src/screens/AddIngredientScreen.js
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

import EncryptedStorage from 'react-native-encrypted-storage';

import {useNavigation, useNavitagion} from '@react-navigation/native';

import DatePicker from 'react-native-date-picker';

import axios from 'axios';
import Button from '../components/Button';

const AddIngredientScreen = () => {
  const route = useRoute();
  const item = route.params.item;
  // console.log(item);

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
          // console.log(response.data);
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
        <Text style={styles.text}>{item.recipe.title}</Text>
      </TouchableOpacity>
    );
  };

  const [updatedQuantity, setUpdatedQuantity] = useState(0);

  const handleQuantityChange = newQuantity => {
    setUpdatedQuantity(newQuantity);
  };

  const handleSave = async newQuantity => {
    try {
      // API 호출을 위한 토큰 가져오기
      let jwt_token = await EncryptedStorage.getItem('jwt_token');
      jwt_token = JSON.parse(jwt_token);

      // API 업데이트 요청 생성
      const apiUrl = 'http://127.0.0.1:8000/api/user-ingredient';
      const headers = {
        Authorization: 'Bearer ' + jwt_token.access_token,
      };
      const body = {
        ingredient_id: item.id,
        quantity: newQuantity,
        start: startDate.toISOString().slice(0, 10), // 등록날짜 값
        end: endDate.toISOString().slice(0, 10), // 소비기한 값
        memo: memo, // 메모 값
      };
      setUpdatedQuantity(newQuantity);

      // API 호출 및 업데이트
      const response = await axios.post(apiUrl, body, {headers: headers});
      setSingleIngredient(response.data);

      // 업데이트 성공 시 사용자에게 피드백을 제공하거나 필요한 작업을 수행
      console.log('저장이 성공했습니다.');

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
      <View style={{flex: 10}}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.title}>카테고리: {item.category.title}</Text>
        {/* <Text style={styles.title}>개수</Text>
        <TextInput
          placeholder={'0'} // 초기값을 문자열로 표시
          inputMode="decimal"
          onChangeText={text => handleQuantityChange(parseFloat(text))}
          style={styles.title}
        /> */}
        <View style={styles.rowbox}>
          <Text style={styles.title}>개수</Text>
          <TextInput
            placeholder="0"
            value={updatedQuantity} // 초기값을 문자열로 표시
            inputMode="decimal"
            onChangeText={text => handleQuantityChange(parseFloat(text))}
            style={styles.title}
          />
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
        <Text style={styles.title}>레시피</Text>
        <FlatList
          data={ingredientRecipe}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
        />
      </View>
      <View style={styles.buttonbox}>
        <Button title="저장" onPress={() => handleSave(updatedQuantity)} />
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

export default AddIngredientScreen;
