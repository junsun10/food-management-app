import React from 'react';
import {View, Button} from 'react-native';
import {Linking} from 'react-native';

const OpenRecipeLink = ({item}) => {
  const openExternalLink = () => {
    const url = 'https://www.10000recipe.com/recipe/' + item;

    // Linking 모듈을 사용하여 외부 브라우저로 하이퍼링크를 엽니다.
    Linking.openURL(url).catch(err =>
      console.error('하이퍼링크 열기 실패: ', err),
    );
  };

  return (
    <View>
      <Button title="상세 레시피" onPress={openExternalLink} />
    </View>
  );
};

export default OpenRecipeLink;
