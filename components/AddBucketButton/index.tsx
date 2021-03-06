import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import CardboardState from '../../model/CardboardState';

interface Props {}

const AddBucketButton = (_: Props) => {
  return (
    <TouchableOpacity
      style={styles.root}
      onPress={() => CardboardState.addBucket()}>
      <Text style={styles.label}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    maxWidth: 300,
    margin: 10,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingTop: 5,
  },
  label: {
    color: 'white',
    fontSize: 32,
  },
});

export default AddBucketButton;
