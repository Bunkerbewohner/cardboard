import React, {useEffect, useRef, useState} from 'react';
import {BucketData, CardData} from '../../model/CardboardData';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import UIState from '../../model/UIState';
import {observer} from 'mobx-react';
import {CARD_MARGIN_TOP} from '../theme';

interface CardProps {
  card?: CardData;
  bucket: BucketData | null;
  isDragging?: boolean; // set to true for the representation of a card being dragged
  children?: React.ReactNode;
}

const Card = observer(({card, bucket, isDragging, children}: CardProps) => {
  if (!card && !children) {
    throw new Error('Card needs either card data or explicit children');
  }

  const [touched, setTouched] = useState(false);
  const [dragging, setDragging] = useState(isDragging);
  const layoutRect = useRef({
    layout: {x: 0, y: 0, width: 0, height: 0} as LayoutRectangle,
  });
  const viewRef = useRef<View>(null);

  const onTouchStart = (_: GestureResponderEvent) => {
    viewRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
      layoutRect.current.layout.x = pageX;
      layoutRect.current.layout.y = pageY - CARD_MARGIN_TOP / 2;
      layoutRect.current.layout.width = width;
      layoutRect.current.layout.height = height;
      setTouched(true);
    });
  };

  const onTouchMove = (e: GestureResponderEvent) => {
    if (card && touched && !isDragging) {
      UIState.onDragStart({
        bucket: bucket!,
        layout: layoutRect.current.layout,
        card: card,
      });
      setTouched(false);
      setDragging(true);
    }
  };

  const onTouchEnd = (_: GestureResponderEvent) => {
    if (card) {
      if (!isDragging) {
        setDragging(false);
      }
      UIState.onDragEnd();
    }
  };

  const onLayout = (e: LayoutChangeEvent) => {
    if (card && !isDragging && !!bucket) {
      UIState.registerCardLayout(bucket, card, e.nativeEvent.layout);
    }
  };

  useEffect(() => {
    return () => {
      if (card && bucket) {
        UIState.unregisterCardLayout(bucket, card);
      }
    };
  }, [bucket, card]);

  const shouldHide = !!UIState.dropTarget && dragging;

  return (
    <View
      ref={viewRef}
      onLayout={onLayout}
      style={[
        styles.root,
        dragging && styles.dragging,
        shouldHide && styles.hidden,
      ]}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchMove}>
      {children ||
        (card && (
          <Text style={dragging && styles.draggingText}>{card.title}</Text>
        ))}
    </View>
  );
});

export default Card;

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 8,
    marginBottom: 5,
    marginTop: CARD_MARGIN_TOP,
    minHeight: 50,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 0.5,
    shadowColor: '#000',
  },
  dragging: {
    backgroundColor: '#c8c8c8',
  },
  hidden: {
    display: 'none',
    margin: 0,
  },
  draggingText: {
    opacity: 0,
  },
});
