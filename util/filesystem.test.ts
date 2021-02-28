import {projectPath} from './filesystem';

describe('projectPath', () => {
  it('works', () => {
    expect(projectPath('data/simple_board')).toMatch(
      /cardboard\/data\/simple_board/,
    );
  });
});
