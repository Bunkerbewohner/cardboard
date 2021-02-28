import * as rnfs from 'react-native-fs';

export function projectPath(relativePath: string) {
  return __dirname + '/../' + relativePath;
}

export async function isDirectory(filePath: string): Promise<boolean> {
  try {
    return (await rnfs.stat(filePath)).isDirectory();
  } catch (ex) {
    console.error(ex);
    return false;
  }
}

export async function readTextFile(filePath: string): Promise<string> {
  return await rnfs.readFile(filePath);
}

export function basename(filePath: string): string {
  const parts = filePath.split('/');
  return parts[parts.length - 1];
}

export async function readdir(path: string): Promise<string[]> {
  return rnfs.readdir(path);
}

export async function readFile(path: string): Promise<string> {
  return rnfs.readFile(path);
}
