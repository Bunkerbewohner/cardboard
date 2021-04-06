import * as React from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
import {useEffect, useRef, useState} from 'react';

interface Props {
  visible: boolean;
  children: React.ReactNode;
  onRequestClose?: () => void;
}

const Modal = ({visible, children, onRequestClose}: Props) => {
  const opacity = useRef(new Animated.Value(0.0)).current;

  useEffect(() => {
    if (visible) {
      const anim = Animated.timing(opacity, {
        duration: 250,
        toValue: 1,
        easing: Easing.ease,
        useNativeDriver: true,
      });
      anim.start();

      return () => anim.stop();
    }
  }, [visible, opacity]);

  if (!visible) {
    return null;
  }

  const onTouchEnd = () => {
    Animated.timing(opacity, {
      duration: 250,
      toValue: 0,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => onRequestClose?.());
  };

  return (
    <Animated.View
      style={[styles.root, {opacity: opacity}]}
      onTouchEnd={onTouchEnd}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    position: 'absolute',
    zIndex: 2,
    width: '100%',
    height: '100%',
  },
});

export default Modal;
