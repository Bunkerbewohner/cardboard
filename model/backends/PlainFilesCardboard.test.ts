import {loadCardboard} from './PlainFiles';
import {projectPath} from '../../util/filesystem';
import {CardData} from '../CardboardData';

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
      {id: 'cb-0', title: 'get started', position: 0},
      {id: 'cb-1', title: 'Load file structure', position: 1},
      {id: 'cb-2', title: 'Display cards', position: 2},
    ]);

    const doing = board.buckets[1].cards;
    expect(doing).toEqual<CardData[]>([
      {id: 'cb-3', title: 'proof of concept', position: 0},
      {id: 'develop it', title: 'develop it', position: 0},
    ]);

    const done = board.buckets[2].cards;
    expect(done).toEqual<CardData[]>([
      {id: 'cb-5', title: 'Setup react native with macOS support', position: 0},
      {id: 'empty', title: 'empty', position: 0},
    ]);
  });
});
