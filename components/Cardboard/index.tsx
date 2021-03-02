import React, {useEffect, useRef, useState} from 'react';
import {Animated, PanResponder, StyleSheet, Text, View} from 'react-native';
import {CardboardData, CardData} from '../../model/CardboardData';
import Bucket from '../Bucket';
import DraggingCard from '../DraggingCard';
import {observer} from 'mobx-react';
import UIState from '../../model/UIState';

interface CardboardProps {
  board: CardboardData;
}

const Cardboard = observer(({board}: CardboardProps) => {
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => !!UIState.dragging,
      onPanResponderGrant: () => {
        UIState.pan.setOffset({
          // @ts-ignore
          x: UIState.dragging?.layout.x, // pan.x._value,
          // @ts-ignore
          y: UIState.dragging?.layout.y, // pan.y._value,
        });
      },
      onPanResponderMove: Animated.event(
        [null, {dx: UIState.pan.x, dy: UIState.pan.y}],
        {
          useNativeDriver: false,
        },
      ),
      onPanResponderRelease: () => {
        //pan.flattenOffset();
      },
    }),
  ).current;

  return (
    <View style={styles.root} {...panResponder.panHandlers}>
      <View style={styles.header}>
        <Text style={styles.title}>Hello, {board.boardName}!</Text>
      </View>
      <View style={styles.buckets}>
        {board.buckets.map((bucket) => (
          <Bucket key={bucket.id} bucket={bucket} />
        ))}
      </View>
      {UIState.dragging && (
        <DraggingCard
          card={UIState.dragging.card}
          size={{
            width: UIState.dragging.layout.width,
            height: UIState.dragging.layout.height,
          }}
          pan={UIState.pan}
        />
      )}
    </View>
  );
});

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
