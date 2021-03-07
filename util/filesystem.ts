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

export async function writeTextFile(
  filePath: string,
  content: string,
): Promise<void> {
  await rnfs.writeFile(filePath, content);
}

export async function mkdir(filePath: string) {
  // TODO iOS: set NSURLIsExcludedFromBackupKey
  await rnfs.mkdir(filePath);
}

export function basename(filePath: string): string {
  const parts = filePath.split('/');
  return parts[parts.length - 1];
}

export function stripFileExtension(filename: string): string {
  return filename.replace(/\..+$/, '');
}

export async function readdir(path: string): Promise<string[]> {
  return rnfs.readdir(path);
}

export async function readFile(path: string): Promise<string> {
  return rnfs.readFile(path);
}
