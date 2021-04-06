import React, {useRef} from 'react';
import {
  ActivityIndicator,
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
import AddBucketButton from '../AddBucketButton';
import CardboardState from '../../model/CardboardState';
import CardDetails from '../CardDetails';
import Modal from '../Modal';

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
      onPanResponderEnd: (e) => UIState.commitDrop(),
    }),
  ).current;

  const onTouchMove = (e: GestureResponderEvent) => {
    UIState.checkForDrop(e.nativeEvent.pageX, e.nativeEvent.pageY);
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={{
        width: '100%', //dimensions.width,
        height: '100%', // dimensions.height,
      }}
      imageStyle={{
        bottom: undefined,
        width: dimensions.width,
        height: dimensions.height,
        resizeMode: 'cover',
      }}>
      {CardboardState.loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            color={'white'}
            style={styles.loading}
            size={'large'}
          />
        </View>
      )}
      <Modal
        visible={!!UIState.view}
        onRequestClose={() => UIState.closeCard()}>
        {UIState.view && <CardDetails card={UIState.view!} />}
      </Modal>
      {!CardboardState.loading && (
        <View
          style={styles.root}
          {...panResponder.panHandlers}
          onTouchMove={onTouchMove}>
          <View style={styles.header}>
            <Text style={styles.title}>{board.boardName}</Text>
          </View>
          <View style={styles.buckets}>
            {board.buckets.map((bucket) => (
              <Bucket key={bucket.id} bucket={bucket} />
            ))}
            <AddBucketButton />
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
      )}
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
  loadingContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  loading: {},
});

export default Cardboard;
