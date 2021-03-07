import sanitize from 'sanitize-filename';

export interface CardboardData {
  boardName: string;
  description?: string;
  buckets: BucketData[];
  /** can be a file path, URL etc. depending on the backend used */
  loadedFrom: string;
  dirty?: boolean;
}

export function defaultCardboard(): CardboardData {
  return {
    boardName: 'New Cardboard',
    buckets: [],
    loadedFrom: '',
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
  dirty?: boolean;
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
  /**
   * The title of a card is always derived from the file's content or name.
   * This field should be considered readonly.
   */
  readonly title: string;
  position: number;
  content?: string; // entire file content
  dirty?: boolean;
}

export function createCard(text: string): CardData {
  return {
    id: sanitize(text),
    title: text,
    position: 0,
    content: '',
  };
}

export interface CardMatter {
  position?: number;
}
