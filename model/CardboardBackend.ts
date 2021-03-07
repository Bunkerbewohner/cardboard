import {CardboardData, CardData} from './CardboardData';

export interface CardboardBackend {
  loadCardboard(): Promise<CardboardData>;
  saveCardboard(cardboard: CardboardData): Promise<void>;
}
