import {
  cardPath,
  loadCardboard,
  loadCardFolder,
  loadCardMeta,
  loadCardMetaFromFile,
  serializeCard,
} from './PlainFiles';
import {projectPath} from '../../util/filesystem';
import {CardData} from '../CardboardData';
import {load} from 'js-yaml';

describe('loadCardMetaFromFile', () => {
  it('parses card.md with a markdown title', async () => {
    const card = await loadCardMetaFromFile(
      projectPath('data/simple_board/To Do/cb-2/card.md'),
    );

    expect(card.title).toBe('Display cards');
    expect(card.position).toBe(2);
  });

  it('parses an empty file', async () => {
    const card = await loadCardMetaFromFile(
      projectPath('data/simple_board/Doing/develop it.md'),
    );
    expect(card.title).toBe('develop it');
    expect(card.position).toBe(0);
  });
});

describe('loadCardFolder', () => {
  it('loads card.md from a folder', async () => {
    const card = await loadCardFolder(
      projectPath('data/simple_board/To Do/cb-2'),
    );
    expect(card.title).toBe('Display cards');
    expect(card.position).toBe(2);
  });
});

describe('loadCardboard', () => {
  it('loads a simple board', async () => {
    const board = await loadCardboard(projectPath('data/simple_board'));
    expect(board.boardName).toBe('Simple Board');

    expect(board.buckets.length).toBe(3);
    expect(board.buckets[0].title).toBe('To Do');
    expect(board.buckets[1].title).toBe('Doing / In Progress');
    expect(board.buckets[2].title).toBe('Done');

    const todo = board.buckets[0].cards;
    expect(todo).toEqual<CardData[]>([
      {
        id: 'cb-0.md',
        title: 'get started',
        content: 'get started',
        position: 0,
      },
      {
        id: 'cb-1',
        title: 'Load file structure',
        content: 'Load file structure',
        position: 1,
      },
      {
        id: 'cb-2',
        title: 'Display cards',
        content: '# Display cards',
        position: 2,
      },
    ]);

    const doing = board.buckets[1].cards;
    expect(doing).toEqual<CardData[]>([
      {
        id: 'cb-3',
        title: 'proof of concept',
        content: '# proof of concept',
        position: 0,
      },
      {id: 'develop it.md', title: 'develop it', position: 0},
    ]);

    const done = board.buckets[2].cards;
    expect(done).toEqual<CardData[]>([
      {
        id: 'cb-5.md',
        title: 'Setup react native with macOS support',
        content: 'Setup react native with macOS support',
        position: 0,
      },
      {id: 'empty', title: 'empty', position: 0},
    ]);
  });
});

it('cardPath constructs the path a loaded card correctly', async () => {
  const board = await loadCardboard(projectPath('data/simple_board'));
  const bucket = board.buckets[1];
  const card = bucket.cards[1];

  expect(bucket.title).toBe('Doing / In Progress');
  expect(bucket.id).toBe('Doing');
  expect(card.title).toBe('develop it');
  expect(card.id).toBe('develop it.md');
  expect(cardPath(board, board.buckets[1], card)).toBe(
    projectPath('data/simple_board/Doing/develop it.md'),
  );
});

describe('serializeCard turns a loaded card back into its file form', () => {
  it('works with frontmatter', async () => {
    const originalFile = `
---
position: 3
---
# Get it done
    `.trim();

    const loadedCard = await loadCardMeta(originalFile);
    expect(loadedCard.position).toBe(3);
    expect(loadedCard.title).toBe('Get it done');
    expect(loadedCard.content).toBe('# Get it done');

    expect(serializeCard(loadedCard)).toBe(originalFile);
  });

  it('works without frontmatter', async () => {
    const originalFileContent = 'take care of this';
    const loadedCard = await loadCardMeta(originalFileContent);
    expect(loadedCard.position).toBe(0);
    expect(loadedCard.content).toBe(originalFileContent);
    expect(loadedCard.title).toBe(originalFileContent);

    expect(serializeCard(loadedCard)).toBe(originalFileContent);
  });

  it('works without frontmatter and with markdown title', async () => {
    const originalFileContent = '# do this';
    const loadedCard = await loadCardMeta(originalFileContent);
    expect(loadedCard.position).toBe(0);
    expect(loadedCard.content).toBe(originalFileContent);
    expect(loadedCard.title).toBe('do this');

    expect(serializeCard(loadedCard)).toBe(originalFileContent);
  });
});
