import {makeAutoObservable, runInAction} from 'mobx';
import {CardboardData, defaultCardboard} from './CardboardData';
import {PlainFiles} from './backends/PlainFiles';

class CardboardState {
  loading: boolean = true;
  cardboard: CardboardData = defaultCardboard();

  async loadCardboard(path: string) {
    const backend = new PlainFiles();
    const cardboard = await backend.loadCardboard(path);
    runInAction(() => {
      console.log('successfully loaded cardboard into state');
      this.cardboard = cardboard;
      this.loading = false;
    });
  }

  constructor() {
    makeAutoObservable(this);
  }
}

const state = new CardboardState();

export default state;
