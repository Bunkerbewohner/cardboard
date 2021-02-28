import {loadCardboard} from './CardboardData';
import {projectPath} from '../util/filesystem';

describe('loadCardboard', () => {
  it('loads a simple board', async () => {
    const board = await loadCardboard(projectPath('data/simple_board'));
    expect(board.boardName).toBe('Simple Board');

    expect(board.buckets.length).toBe(3);
    expect(board.buckets[0].title).toBe('To Do');
    expect(board.buckets[1].title).toBe('Doing / In Progress');
    expect(board.buckets[2].title).toBe('Done');

    const todo = board.buckets[0].cards;
    expect(todo.length).toBe(3);
    expect(todo[0].id).toBe('cb-0');
    expect(todo[0].title).toBe('get started');
    expect(todo[1].id).toBe('cb-1');
    expect(todo[1].title).toBe('Load file structure');
    expect(todo[2].id).toBe('cb-2');
    expect(todo[2].title).toBe('Display cards');
  });
});
