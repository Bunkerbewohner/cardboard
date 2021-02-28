import React from 'react';
import {BucketData} from '../../model/CardboardData';
import {View, Text, StyleSheet} from 'react-native';
import Card from '../Card';

interface BucketProps {
  bucket: BucketData;
}

const Bucket = ({bucket}: BucketProps) => {
  return (
    <View style={styles.root}>
      <View style={styles.bucket}>
        <Text style={styles.title}>{bucket.title}</Text>

        <View style={styles.cardContainer}>
          {bucket.cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
  },
  bucket: {
    flex: 0,
    margin: 10,
    padding: 8,
    backgroundColor: '#eeeeee',
    borderRadius: 4,
    flexDirection: 'column',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardContainer: {},
});

export default Bucket;
