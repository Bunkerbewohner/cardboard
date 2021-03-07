import {
  basename,
  isDirectory,
  readdir,
  readFile,
  stripFileExtension,
} from '../../util/filesystem';
import matter from 'front-matter';
import {
  BucketData,
  BucketMatter,
  CardboardData,
  CardboardMatter,
  CardData,
  CardMatter,
} from '../CardboardData';
import {CardboardBackend} from '../CardboardBackend';
import * as fs from '../../util/filesystem';
import yaml from 'js-yaml';

/**
 * Stores cards as regular folders and files.
 * Ids of cards and buckets correspond to file / folder names.
 * See `data/simple_board` for an example.
 *
 * Cardboard:
 * An optional `board.md` can be defined at the root of the cardboard folder.
 * See `CardboardMatter` for options, e.g. title of the board.
 *
 * Buckets:
 * Top-level folders represent buckets. Name, description and column of the bucket
 * can be defined via a bucket.md file in that folder. See `BucketMatter` interface.
 *
 * Cards:
 * Within each bucket folder cards can be defined as files or folders.
 * An empty .md file (e.g. `do dishes.md`) will be an unpositioned task "do dishes".
 * The .md file can contain a title, description and meta data such as the position
 * within the bucket. See `CardMatter`.
 * An empty folder (e.g. `pay bills`) will also be an unpositioned task ("pay bills").
 * Within card folders details can be specified using a `card.md` file.
 */
export class PlainFiles implements CardboardBackend {
  constructor(public readonly path: string) {}

  async loadCardboard(): Promise<CardboardData> {
    return loadCardboard(this.path);
  }

  async saveCardboard(cardboard: CardboardData) {
    await saveCardboard(cardboard);
  }
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
    if (file !== 'bucket.md' && file.endsWith('.md')) {
      cards.push(await loadCardMetaFromFile(fullpath));
    } else if (await isDirectory(fullpath)) {
      cards.push(await loadCardFolder(fullpath));
    } else {
      // silently ignore unknown files
    }
  }

  return cards.sort((a, b) => a.position - b.position);
}

export async function loadCardFolder(pathToCard: string): Promise<CardData> {
  try {
    const card = await loadCardMetaFromFile(pathToCard + '/card.md');
    card.id = basename(pathToCard);
    return card;
  } catch (ex) {
    // empty folder
    return {
      id: basename(pathToCard),
      title: basename(pathToCard),
      position: 0,
    };
  }
}

export function doesContentJustContainTitle(
  markdownContent: string,
  title: string,
): boolean {
  const content = markdownContent.trim();

  return content === title || content === '# ' + title;
}

export async function loadCardMetaFromFile(
  filepath: string,
): Promise<CardData> {
  const markdown = (await readFile(filepath)).toString();
  const card = await loadCardMeta(markdown);
  card.id = basename(filepath);

  if (!card.title) {
    // title is declared readonly for users of the API; this circumvents the type error
    (card as any).title = getFilenameAsTile(filepath);
  }

  return card;
}

export async function loadCardMeta(markdown: string): Promise<CardData> {
  const frontmatter = matter<CardMatter>(markdown);
  const title = loadCardTitle(frontmatter.body);

  const data: CardData = {
    id: '', // determined by loadCardMetaFromFile
    title: title,
    position: frontmatter.attributes.position || 0,
  };

  const content = frontmatter.body.trim();
  if (content) {
    data.content = content;
  }
  return data;
}

function getFilenameAsTile(file: string): string {
  return stripFileExtension(basename(file));
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
      loadedFrom: file,
    };
  } catch (ex) {
    // no board metadata defined
    return {
      boardName: basename(file),
      buckets: [],
      loadedFrom: file,
    };
  }
}

export async function saveCardboard(cardboard: CardboardData) {
  console.log(`Saving cardboard at ${cardboard.loadedFrom}...`);

  if (cardboard.dirty) {
    // TODO: Save modified metadata
  }

  for (let bucket of cardboard.buckets) {
    if (bucket.dirty) {
      // TODO: Save modified metadata
    }

    for (let card of bucket.cards) {
      if (card.dirty) {
        delete card.dirty;
        await saveCard(cardboard, bucket, card);
      }
    }
  }
}

export function cardPath(
  cardboard: CardboardData,
  bucket: BucketData,
  card: CardData,
): string {
  return `${cardboard.loadedFrom}/${bucket.id}/${card.id}`;
}

export async function saveCard(
  cardboard: CardboardData,
  bucket: BucketData,
  card: CardData,
) {
  const path = cardPath(cardboard, bucket, card);
  const fileContent = serializeCard(card);

  if (path.endsWith('.md')) {
    // single-file based
    await fs.writeTextFile(path, fileContent);
  } else {
    // folder based
    await fs.mkdir(path);
    await fs.writeTextFile(path + '/card.md', fileContent);
  }
}

export function serializeCard(card: CardData): string {
  const markdown = card.content;
  const matterFields: any = {...card};
  delete matterFields.dirty;
  delete matterFields.id; // corresponds to the file name already, doesn't need to be saved
  delete matterFields.title; // is derived from the markdown content (or filename)
  delete matterFields.content; // saved below the frontmatter as the file content

  if (matterFields.position === 0) {
    delete matterFields.position;
  }

  if (Object.keys(matterFields).length === 0) {
    return markdown || '';
  }

  const frontmatter = '---\n' + yaml.dump(matterFields) + '---\n';

  if (markdown) {
    return frontmatter + markdown;
  } else {
    return frontmatter;
  }
}
