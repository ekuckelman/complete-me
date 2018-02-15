var path = require('path');

module.exports = {
  entry: 'lib/.trie',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
