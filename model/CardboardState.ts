import {makeAutoObservable, runInAction} from 'mobx';
import {
  BucketData,
  CardboardData,
  CardData,
  createBucket,
  createCard,
  defaultCardboard,
} from './CardboardData';
import {PlainFiles} from './backends/PlainFiles';
import {nanoid} from 'nanoid/non-secure';
import {CardboardBackend} from './CardboardBackend';

class CardboardState {
  loading: boolean = true;
  cardboard: CardboardData = defaultCardboard();

  backend: CardboardBackend;

  constructor() {
    this.backend = new PlainFiles('.');
    makeAutoObservable(this);
  }

  save() {
    this.backend.saveCardboard(this.cardboard);
  }

  async loadCardboard(path: string) {
    this.backend = new PlainFiles(path);
    const cardboard = await this.backend.loadCardboard();
    runInAction(() => {
      console.log('successfully loaded cardboard into state');
      this.cardboard = cardboard;
      this.loading = false;
    });
  }

  addBucket() {
    const bucket = createBucket('New Bucket');
    bucket.column = this.numColumns();

    // ensure unique id
    const desiredId = bucket.id;
    do {
      if (this.cardboard.buckets.find((b) => b.id === bucket.id)) {
        bucket.id = desiredId + '-' + nanoid(4);
      } else {
        break;
      }
    } while (true);

    this.cardboard.buckets.push(bucket);
    this.save();
  }

  addCard(bucketId: string, text: string) {
    const bucket = this.cardboard.buckets.find((b) => b.id === bucketId);
    if (!bucket) {
      throw new Error(`Could not find bucket '${bucketId}'`);
    }

    if (!text.trim()) {
      throw new Error('Cannot create card with empty text');
    }

    const card = createCard(text.trim());
    card.position = bucket.cards.length;
    card.dirty = true;

    // ensure unique id
    const desiredId = card.id;
    do {
      if (bucket.cards.find((c) => c.id === card.id)) {
        card.id = desiredId + '-' + nanoid(4);
      } else {
        break;
      }
    } while (true);

    bucket.cards.push(card);
    this.save();
  }

  moveCard(
    card: CardData,
    destinationBucketId: string,
    insertAfter?: CardData,
  ) {
    const sourceBucket = this.getCardBucket(card);
    const destBucket = this.getBucket(destinationBucketId);

    if (!sourceBucket || !destBucket) {
      throw new Error(
        'invalid card move: source or destination bucket not found',
      );
    }

    const sourceIndex = sourceBucket.cards.findIndex((c) => c.id === card.id);
    sourceBucket.cards.splice(sourceIndex, 1);

    if (!insertAfter) {
      destBucket.cards.splice(0, 0, card);
    } else {
      const index = destBucket.cards.findIndex((c) => c.id === insertAfter.id);
      if (index < 0) {
        throw new Error(
          `invalid card move: card to insert after not found - '${insertAfter.title}'`,
        );
      }

      if (index < destBucket.cards.length - 1) {
        destBucket.cards.splice(index + 1, 0, card);
      } else {
        destBucket.cards.push(card);
      }
    }

    this._updateCardPositions(destBucket);
    this.save();
  }

  /**
   * Sets the position value of each card to its index in the card list.
   * Serializes cards where the value changed.
   */
  _updateCardPositions(bucket: BucketData) {
    for (let i = 0; i < bucket.cards.length; i++) {
      const card = bucket.cards[i];
      if (card.position !== i) {
        card.position = i;
        card.dirty = true;
      }
    }
  }

  getCardBucket(card: CardData): BucketData | undefined {
    // TODO: Optimize this
    for (let bucket of this.cardboard.buckets) {
      if (bucket.cards.find((c) => c.id === card.id)) {
        return bucket;
      }
    }

    return undefined;
  }

  getBucket(id: string): BucketData | undefined {
    return this.cardboard.buckets.find((b) => b.id === id);
  }

  numColumns() {
    return this.cardboard.buckets.length;
  }
}

const state = new CardboardState();

export default state;
