import {isDirectory, projectPath} from './filesystem';
import * as fs from 'fs';

describe('projectPath', () => {
  it('works', () => {
    expect(fs.existsSync(projectPath('data/simple_board'))).toBe(true);
  });
});
