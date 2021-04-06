import {makeAutoObservable} from 'mobx';
import {BucketData, CardData} from './CardboardData';
import {Animated, LayoutRectangle} from 'react-native';
import CardboardState from './CardboardState';

export interface DragInfo {
  bucket: BucketData;
  card: CardData;
  layout: LayoutRectangle;
}

export interface DropTarget {
  bucket: BucketData;
  card?: CardData;
}

class UIState {
  view: CardData | null = null;
  dragging: DragInfo | null = null;
  pan: Animated.ValueXY = new Animated.ValueXY();
  cardLayouts: {
    [bucketId: string]: {card: CardData; layout: LayoutRectangle}[];
  } = {};
  // TODO: use dict instead of list
  dropSlotLayouts: {
    [bucketId: string]: {card?: CardData; layout: LayoutRectangle}[];
  } = {};
  bucketLayouts: {bucket: BucketData; layout: LayoutRectangle}[] = [];
  dropTarget: DropTarget | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  openCard(card: CardData) {
    this.view = card;
  }

  closeCard() {
    this.view = null;
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
    this.dropTarget = null;
  }

  registerCardLayout(
    bucket: BucketData,
    card: CardData,
    layout: LayoutRectangle,
  ) {
    const layouts = this.getCardLayouts(bucket.id);
    layouts.push({card, layout});
  }

  getCardLayouts(bucketId: string) {
    if (!this.cardLayouts[bucketId]) {
      this.cardLayouts[bucketId] = [];
    }
    return this.cardLayouts[bucketId];
  }

  unregisterCardLayout(bucket: BucketData, card: CardData) {
    const layouts = this.getCardLayouts(bucket.id);
    const index = layouts.findIndex((x) => x.card.id === card.id);
    if (index >= 0) {
      layouts.splice(index, 1);
    }
  }

  getDropSlotLayouts(bucketId: string) {
    if (!this.dropSlotLayouts[bucketId]) {
      this.dropSlotLayouts[bucketId] = [];
    }
    return this.dropSlotLayouts[bucketId];
  }

  registerDropSlot(
    bucket: BucketData,
    layout: LayoutRectangle,
    card?: CardData,
  ) {
    const layouts = this.getDropSlotLayouts(bucket.id);
    const existing = layouts.find((e) => e.card?.id === card?.id);
    if (existing) {
      existing.layout = layout;
    } else {
      layouts.push({card, layout});
    }
  }

  unregisterDropSlot(bucket: BucketData, card?: CardData) {
    const layouts = this.getDropSlotLayouts(bucket.id);
    const index = layouts.findIndex((x) => {
      return card ? x.card?.id === card.id : !x.card;
    });
    if (index >= 0) {
      layouts.splice(index, 1);
    }
  }

  registerBucketLayout(bucket: BucketData, layout: LayoutRectangle) {
    this.bucketLayouts.push({bucket, layout});
  }

  unregisterBucketLayout(bucket: BucketData) {
    this.bucketLayouts = this.bucketLayouts.filter(
      (b) => b.bucket.id !== bucket.id,
    );
  }

  commitDrop() {
    if (!this.dragging || !this.dropTarget) {
      return;
    }

    const card = this.dragging.card;
    const insertAfter = this.dropTarget?.card;

    CardboardState.moveCard(card, this.dropTarget.bucket.id, insertAfter);
  }

  checkForDrop(x: number, y: number) {
    if (!this.dragging) {
      return;
    }
    this.dropTarget = null;
    this.bucketLayouts.forEach((bl) =>
      this._checkBucketForDrop(bl.bucket, bl.layout, x, y),
    );
  }

  _checkBucketForDrop(
    bucket: BucketData,
    bucketLayout: LayoutRectangle,
    x: number,
    y: number,
  ) {
    if (x < bucketLayout.x || x > bucketLayout.x + bucketLayout.width) {
      return;
    }
    if (y < bucketLayout.y || y > bucketLayout.y + bucketLayout.height) {
      return;
    }

    const dropSlots = this.getDropSlotLayouts(bucket.id);
    if (dropSlots.length === 0) {
      return;
    }

    let closestCard: CardData | undefined = dropSlots[0].card;
    let minDistance = 999999;

    for (let entry of dropSlots) {
      const dropSlot = entry.layout;
      const dropSlotCenter = {
        x: bucketLayout.x + dropSlot.x + dropSlot.width / 2,
        y: bucketLayout.y + dropSlot.y + dropSlot.height / 2,
      };
      const distance = Math.sqrt(
        Math.pow(dropSlotCenter.x - x, 2) +
          Math.pow(dropSlotCenter.y - y + 50, 2),
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestCard = entry.card;
      }
    }

    if (this.dragging?.bucket?.id === bucket.id) {
      const draggingIndex = bucket.cards.findIndex(
        (c) => c.id === this.dragging?.card.id,
      );
      const cardAboveDragging =
        draggingIndex > 0 ? bucket.cards[draggingIndex - 1] : null;

      if (closestCard?.id === cardAboveDragging?.id) {
        this.dropTarget = null;
        return;
      }
    }

    if (closestCard?.id === this.dragging?.card.id) {
      this.dropTarget = null;
    } else {
      this.dropTarget = {bucket, card: closestCard};
    }
  }
}

const instance = new UIState();

export default instance;
