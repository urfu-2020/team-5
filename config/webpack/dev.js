const { merge } = require('webpack-merge');

const path = require('path');
const common = require('./common');
const paths = require('./paths');

module.exports = merge(common, {
  mode: 'development',
  output: {
    path: path.join(paths.src, 'js'),
    filename: 'devBundle.js',
    publicPath: paths.src,
    clean: true
  },
  devtool: 'eval-cheap-source-map'
});
