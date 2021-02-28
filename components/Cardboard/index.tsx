import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CardboardData} from '../../model/CardboardData';
import Bucket from '../Bucket';

interface CardboardProps {
  board: CardboardData;
}

const Cardboard = ({board}: CardboardProps) => {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Hello, {board.boardName}!</Text>
      </View>
      <View style={styles.buckets}>
        {board.buckets.map((bucket) => (
          <Bucket key={bucket.id} bucket={bucket} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#dadada',
  },
  buckets: {
    flexDirection: 'row',
    flex: 1,
  },
  header: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Cardboard;
