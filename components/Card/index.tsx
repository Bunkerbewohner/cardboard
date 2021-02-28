import React from 'react';
import {CardData} from '../../model/CardboardData';
import {StyleSheet, Text, View} from 'react-native';

interface CardProps {
  card: CardData;
}

const Card = ({card}: CardProps) => {
  return (
    <View style={styles.root}>
      <Text>{card.title}</Text>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 8,
    marginBottom: 5,
    marginTop: 5,
    minHeight: 50,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 0.5,
    shadowColor: '#000',
  },
});
