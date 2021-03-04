import React, {useEffect, useRef} from 'react';
import Card from '../Card';
import {CardData} from '../../model/CardboardData';
import {Animated, StyleSheet} from 'react-native';

interface Props {
  card: CardData;
  size: {width: number; height: number};
  pan: Animated.ValueXY;
}

const DraggingCard = ({card, size, pan}: Props) => {
  return (
    <Animated.View
      style={[
        styles.root,
        {
          transform: [
            {translateX: pan.x},
            {translateY: pan.y},
            {rotateZ: '-2deg'},
          ],
        },
        {width: size.width, height: size.height},
      ]}>
      <Card card={card} bucket={null} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#000',
    shadowOpacity: 0.33,
  },
});

export default DraggingCard;
