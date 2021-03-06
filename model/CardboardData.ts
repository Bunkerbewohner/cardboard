export interface CardboardData {
  boardName: string;
  description?: string;
  buckets: BucketData[];
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

export interface BucketMatter {
  title?: string;
  column?: number;
}

export interface CardData {
  id: string; // <PREFIX>-<HASH>
  title: string;
  position: number;
}

export interface CardMatter {
  title?: string;
  position?: number;
}
