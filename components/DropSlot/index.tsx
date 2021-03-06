import * as React from 'react';
import {BucketData, CardData} from '../../model/CardboardData';
import {observer} from 'mobx-react';
import {LayoutChangeEvent, StyleSheet, View} from 'react-native';
import UIState from '../../model/UIState';
import {useEffect} from 'react';
import {CARD_MARGIN_TOP} from '../theme';

interface DropSlotProps {
  /**
   * the card which immediately precedes this drop slot, or undefined for the top
   */
  card?: CardData;
  bucket: BucketData;
}

const DropSlot = observer(({bucket, card}: DropSlotProps) => {
  const onLayout = (e: LayoutChangeEvent) => {
    if (bucket) {
      UIState.registerDropSlot(bucket, e.nativeEvent.layout, card);
    }
  };

  useEffect(() => {
    return () => {
      if (bucket) {
        UIState.unregisterDropSlot(bucket, card);
      }
    };
  }, []);

  const dropTarget = UIState.dropTarget;
  const hover =
    dropTarget &&
    dropTarget.bucket.id === bucket.id &&
    (card ? dropTarget.card?.id === card.id : !dropTarget.card);

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.dropSlot,
        hover && styles.dropSlotActive,
        hover && {height: UIState.dragging?.layout?.height || 50},
      ]}
    />
  );
});

const styles = StyleSheet.create({
  dropSlot: {
    height: 0,
  },
  dropSlotActive: {
    backgroundColor: '#c8c8c8',
    borderRadius: 4,
    marginTop: CARD_MARGIN_TOP,
    marginBottom: 5,
  },
});

export default DropSlot;
