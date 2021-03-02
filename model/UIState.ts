import {makeAutoObservable} from 'mobx';
import {CardData} from './CardboardData';
import {Animated, LayoutRectangle} from 'react-native';

export interface DragInfo {
  card: CardData;
  layout: LayoutRectangle;
}

class UIState {
  dragging: DragInfo | null = null;
  pan: Animated.ValueXY = new Animated.ValueXY();

  constructor() {
    makeAutoObservable(this);
  }

  onDragStart(dragInfo: DragInfo) {
    this.dragging = dragInfo;
    this.pan.setValue({x: 0, y: 0});
    this.pan.setOffset({
      x: dragInfo.layout.x,
      y: dragInfo.layout.y,
    });
  }

  onDragEnd() {
    this.dragging = null;
  }
}

const instance = new UIState();

export default instance;
