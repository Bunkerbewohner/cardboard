import React, {useRef} from 'react';
import {
  Animated,
  GestureResponderEvent,
  ImageBackground,
  PanResponder,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {CardboardData} from '../../model/CardboardData';
import Bucket from '../Bucket';
import DraggingCard from '../DraggingCard';
import {observer} from 'mobx-react';
import UIState from '../../model/UIState';

// @ts-ignore
import backgroundImage from '../../backgrounds/mountains.jpg';

interface CardboardProps {
  board: CardboardData;
}

const Cardboard = observer(({board}: CardboardProps) => {
  const dimensions = useWindowDimensions();

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
    }),
  ).current;

  const onTouchMove = (e: GestureResponderEvent) => {
    UIState.checkForDrop(e.nativeEvent.pageX, e.nativeEvent.pageY);
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
      imageStyle={{
        bottom: undefined,
        width: dimensions.width,
        height: dimensions.height,
        resizeMode: 'cover',
      }}>
      <View
        style={styles.root}
        {...panResponder.panHandlers}
        onTouchMove={onTouchMove}>
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
    </ImageBackground>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
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
  backgroundImage: {},
});

export default Cardboard;
