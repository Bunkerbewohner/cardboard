import React, {useRef, useState} from 'react';
import {CardData} from '../../model/CardboardData';
import {
  GestureResponderEvent,
  LayoutRectangle,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import UIState from '../../model/UIState';

interface CardProps {
  card: CardData;
  isDragging?: boolean; // set to true for the representation of a card being dragged
}

const MARGIN_TOP = 5;

const Card = ({card, isDragging}: CardProps) => {
  const [touched, setTouched] = useState(false);
  const [dragging, setDragging] = useState(isDragging);
  const layoutRect = useRef({
    layout: {x: 0, y: 0, width: 0, height: 0} as LayoutRectangle,
  });
  const viewRef = useRef<View>(null);

  const onTouchStart = (_: GestureResponderEvent) => {
    viewRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
      layoutRect.current.layout.x = pageX;
      layoutRect.current.layout.y = pageY - MARGIN_TOP / 2;
      layoutRect.current.layout.width = width;
      layoutRect.current.layout.height = height;
      setTouched(true);
    });
  };

  const onTouchMove = (e: GestureResponderEvent) => {
    if (touched && !isDragging) {
      UIState.onDragStart({
        layout: layoutRect.current.layout,
        card: card,
      });
      setTouched(false);
      setDragging(true);
    }
  };

  const onTouchEnd = (_: GestureResponderEvent) => {
    if (!isDragging) {
      setDragging(false);
    }
    UIState.onDragEnd();
  };

  return (
    <View
      ref={viewRef}
      style={[styles.root, dragging && styles.dragging]}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchMove}>
      <Text style={dragging && styles.draggingText}>{card.title}</Text>
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
    marginTop: MARGIN_TOP,
    minHeight: 50,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 0.5,
    shadowColor: '#000',
  },
  dragging: {
    backgroundColor: '#c8c8c8',
  },
  draggingText: {
    opacity: 0,
  },
});
