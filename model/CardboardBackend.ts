import {CardboardData} from './CardboardData';

export interface CardboardBackend {
  loadCardboard(path: string): Promise<CardboardData>;
}
