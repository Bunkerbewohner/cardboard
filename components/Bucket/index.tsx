import React, {useEffect, useRef, useState} from 'react';
import {BucketData, CardData} from '../../model/CardboardData';
import {View, Text, StyleSheet} from 'react-native';
import Card, {DropSlot} from '../Card';
import {observer} from 'mobx-react';
import UIState from '../../model/UIState';

interface BucketProps {
  bucket: BucketData;
}

interface BucketSliceProps {
  bucket: BucketData;
  card: CardData;
}

const BucketSlice = ({bucket, card}: BucketSliceProps) => {
  return (
    <>
      <Card card={card} bucket={bucket} />
      <DropSlot bucket={bucket} card={card} />
    </>
  );
};

const Bucket = observer(({bucket}: BucketProps) => {
  const [isDropTarget, setIsDropTarget] = useState(false);
  const viewRef = useRef<View>(null);

  const onLayout = () => {
    viewRef.current?.measure((x, y, width, height, pageX, pageY) => {
      UIState.registerBucketLayout(bucket, {x: pageX, y: pageY, width, height});
    });
  };

  useEffect(() => {
    return () => {
      UIState.unregisterBucketLayout(bucket);
    };
  }, [bucket]);

  return (
    <View style={styles.root} onLayout={onLayout} ref={viewRef}>
      <View style={styles.bucket}>
        <Text style={styles.title}>{bucket.title}</Text>

        <View style={styles.cardContainer}>
          <DropSlot bucket={bucket} card={undefined} />

          {bucket.cards.map((card) => (
            <BucketSlice key={card.id} bucket={bucket} card={card} />
          ))}

          {UIState.dragging && isDropTarget && (
            <Card
              card={UIState.dragging.card}
              bucket={bucket}
              isDragging={true}
            />
          )}
        </View>
      </View>
    </View>
  );
});

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
  bucketSlice: {
    flexDirection: 'column',
  },
});

export default Bucket;
