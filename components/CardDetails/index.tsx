import * as React from 'react';
import {CardData} from '../../model/CardboardData';
import {StyleSheet, Text, View} from 'react-native';

interface Props {
  card: CardData;
}

const CardDetails = ({card}: Props) => {
  return (
    <View style={styles.root}>
      <Text>{card.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    borderRadius: 5,
    height: '100%',
    shadowRadius: 6,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 1},
  },
});

export default CardDetails;
