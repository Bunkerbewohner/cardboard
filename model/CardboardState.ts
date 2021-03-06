import {makeAutoObservable, runInAction} from 'mobx';
import {
  BucketData,
  CardboardData,
  createBucket,
  createCard,
  defaultCardboard,
} from './CardboardData';
import {PlainFiles} from './backends/PlainFiles';
import {nanoid} from 'nanoid/non-secure';

class CardboardState {
  loading: boolean = true;
  cardboard: CardboardData = defaultCardboard();

  constructor() {
    makeAutoObservable(this);
  }

  async loadCardboard(path: string) {
    const backend = new PlainFiles();
    const cardboard = await backend.loadCardboard(path);
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
  }

  numColumns() {
    return this.cardboard.buckets.length;
  }
}

const state = new CardboardState();

export default state;
