import * as fs from 'fs';

/**
 * Since these tests run on node this 'mocks' the react-native implementation of fs
 * with the node's actual fs module.
 */

module.exports = {
  readdir: fs.promises.readdir,
  readFile: fs.promises.readFile,
  stat: fs.promises.stat,
};
