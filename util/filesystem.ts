import * as path from 'path';
import * as fs from 'fs';

export function projectPath(relativePath: string) {
  return path.join(__dirname, '../', relativePath);
}

export async function isDirectory(filePath: string): Promise<boolean> {
  const stat = await fs.promises.lstat(filePath);
  return stat.isDirectory();
}
