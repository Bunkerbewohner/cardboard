import sanitize from 'sanitize-filename';

export interface CardboardData {
  boardName: string;
  description?: string;
  buckets: BucketData[];
}

export function defaultCardboard(): CardboardData {
  return {
    boardName: 'New Cardboard',
    buckets: [],
  };
}

export interface CardboardMatter {
  title?: string;
}

export interface BucketData {
  id: string;
  title: string;
  column: number;
  cards: CardData[];
}

export function createBucket(name: string): BucketData {
  return {
    id: sanitize(name),
    title: name,
    column: 0,
    cards: [],
  };
}

export interface BucketMatter {
  title?: string;
  column?: number;
}

export interface CardData {
  id: string; // <PREFIX>-<HASH>
  title: string;
  position: number;
}

export function createCard(text: string): CardData {
  return {
    id: sanitize(text),
    title: text,
    position: 0,
  };
}

export interface CardMatter {
  title?: string;
  position?: number;
}
