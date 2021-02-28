import * as fs from 'fs';
import {basename, join} from 'path';
import matter from 'gray-matter';
import * as path from 'path';
import * as assert from 'assert';
import {isDirectory} from '../util/filesystem';

export interface CardboardData {
  boardName: string;
  description?: string;
  buckets: BucketData[];
}

export interface BucketData {
  id: string;
  title: string;
  column: number;
  cards: CardData[];
}

export interface CardData {
  id: string; // <PREFIX>-<HASH>
  title: string;
  position: number;
}

export async function loadCardboard(path: string): Promise<CardboardData> {
  const board = await loadCardboardMeta(path);
  board.buckets = await loadBuckets(path);

  return board;
}

export async function loadBuckets(path: string): Promise<BucketData[]> {
  const files = await fs.promises.readdir(path);
  const buckets: BucketData[] = [];

  for (let file of files) {
    if (file !== 'board.md' && file.endsWith('.md')) {
      throw new Error(
        `Unexpected markdown file ${join(
          path,
          file,
        )}: Cards must be in a bucket (subfolder)`,
      );
    } else if (file !== 'board.md') {
      const bucket = await loadBucketMeta(join(path, file));
      bucket.cards = await loadCardsFromBucket(join(path, file));
      buckets.push(bucket);
    }
  }

  return buckets.sort((a, b) => a.column - b.column);
}

export async function loadCardsFromBucket(
  bucketPath: string,
): Promise<CardData[]> {
  const files = await fs.promises.readdir(bucketPath);
  const cards: CardData[] = [];

  for (let file of files) {
    if (file.endsWith('.md')) {
      cards.push(await loadCardMeta(join(bucketPath, file)));
    } else if (await isDirectory(join(bucketPath, file))) {
      cards.push(await loadCardFolder(join(bucketPath, file)));
    } else {
      // silently ignore unknown files
    }
  }

  return cards.sort((a, b) => a.position - b.position);
}

export async function loadCardFolder(cardPath: string): Promise<CardData> {
  try {
    const card = await loadCardMeta(join(cardPath, 'card.md'));
    card.id = basename(cardPath);

    return card;
  } catch (ex) {
    console.error(`Failed to load card from ${cardPath}`, ex);
    return {
      id: basename(cardPath),
      title: `Failed to load ${basename(cardPath)}`,
      position: 0,
    };
  }
}

export async function loadCardMeta(file: string): Promise<CardData> {
  const markdown = (await fs.promises.readFile(file)).toString();

  const frontmatter = matter(markdown);

  return {
    title: frontmatter.data.title || loadCardTitle(frontmatter.content),
    id: basename(file).split('.', 2)[0],
    position: frontmatter.data.position || 0,
  };
}

export function loadCardTitle(markdown: string): string {
  markdown = markdown.trim();

  if (markdown.startsWith('#')) {
    return markdown.match(/#\s+(.+)/)?.[1] || markdown;
  } else {
    return markdown;
  }
}

export async function loadBucketMeta(file: string): Promise<BucketData> {
  try {
    const markdown = (
      await fs.promises.readFile(join(file, 'bucket.md'))
    ).toString();

    const frontmatter = matter(markdown);

    return {
      title: frontmatter.data.title || frontmatter.content || basename(file),
      column: parseInt(frontmatter.data.column || '0', 10) || 0,
      cards: [],
      id: basename(file),
    };
  } catch {
    return {
      title: basename(file),
      column: 0,
      cards: [],
      id: basename(file),
    };
  }
}

export async function loadCardboardMeta(file: string): Promise<CardboardData> {
  try {
    const markdown = (
      await fs.promises.readFile(file + '/board.md')
    ).toString();

    const frontmatter = matter(markdown);

    return {
      boardName: frontmatter.data.title || basename(file),
      description: frontmatter.content,
      buckets: [],
    };
  } catch (ex) {
    console.error(ex);
    return {
      boardName: basename(file),
      buckets: [],
    };
  }
}
