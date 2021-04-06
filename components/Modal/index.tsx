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
  const slideIn = useRef(new Animated.Value(50.0)).current;

  useEffect(() => {
    if (visible) {
      const fadeInAnim = Animated.timing(opacity, {
        duration: 250,
        toValue: 1,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });
      const slideInAnim = Animated.timing(slideIn, {
        duration: 250,
        toValue: 0,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });
      Animated.stagger(150, [fadeInAnim, slideInAnim]).start();

      return () => fadeInAnim.stop();
    }
  }, [visible, opacity, slideIn]);

  if (!visible) {
    return null;
  }

  const onTouchEnd = () => {
    Animated.timing(opacity, {
      duration: 250,
      toValue: 0,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => onRequestClose?.());
  };

  return (
    <Animated.View
      style={[styles.root, {opacity: opacity}]}
      onTouchEnd={onTouchEnd}>
      <Animated.View
        style={[styles.content, {transform: [{translateY: slideIn}]}]}>
        {children}
      </Animated.View>
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
  content: {
    flex: 1,
  },
});

export default Modal;
