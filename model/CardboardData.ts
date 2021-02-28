import matter from 'front-matter';
import {basename, isDirectory, readdir, readFile} from '../util/filesystem';

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

export async function loadCardboard(path: string): Promise<CardboardData> {
  console.log(`Loading cardboard from '${path}...`);
  const board = await loadCardboardMeta(path);
  board.buckets = await loadBuckets(path);

  return board;
}

export async function loadBuckets(path: string): Promise<BucketData[]> {
  const files = await readdir(path);
  const buckets: BucketData[] = [];

  for (let file of files) {
    const fullpath = path + '/' + file;
    if (file !== 'board.md' && file.endsWith('.md')) {
      throw new Error(
        `Unexpected markdown file ${fullpath}: Cards must be in a bucket (subfolder)`,
      );
    } else if (file !== 'board.md') {
      const bucket = await loadBucketMeta(fullpath);
      bucket.cards = await loadCardsFromBucket(fullpath);
      buckets.push(bucket);
    }
  }

  return buckets.sort((a, b) => a.column - b.column);
}

export async function loadCardsFromBucket(
  bucketPath: string,
): Promise<CardData[]> {
  const files = await readdir(bucketPath);
  const cards: CardData[] = [];

  for (let file of files) {
    const fullpath = bucketPath + '/' + file;
    if (file.endsWith('.md')) {
      cards.push(await loadCardMeta(fullpath));
    } else if (await isDirectory(fullpath)) {
      cards.push(await loadCardFolder(fullpath));
    } else {
      // silently ignore unknown files
    }
  }

  return cards.sort((a, b) => a.position - b.position);
}

export async function loadCardFolder(cardPath: string): Promise<CardData> {
  try {
    const card = await loadCardMeta(cardPath + '/card.md');
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
  const markdown = (await readFile(file)).toString();
  const frontmatter = matter<CardMatter>(markdown);

  return {
    title: frontmatter.attributes.title || loadCardTitle(frontmatter.body),
    id: basename(file).split('.', 2)[0],
    position: frontmatter.attributes.position || 0,
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
    const markdown = (await readFile(file + '/bucket.md')).toString();
    const frontmatter = matter<BucketMatter>(markdown);

    return {
      title: frontmatter.attributes.title || frontmatter.body || basename(file),
      column: frontmatter.attributes.column || 0,
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
    const markdown = (await readFile(file + '/board.md')).toString();
    const frontmatter = matter<CardboardMatter>(markdown);

    return {
      boardName: frontmatter.attributes.title || basename(file),
      description: frontmatter.body,
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
