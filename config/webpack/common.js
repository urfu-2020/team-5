const paths = require('./paths');

const babelLoader = {
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-env'],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ]
  }
};

module.exports = {
  entry: `${paths.src}/index.js`,
  mode: 'none',
  resolve: {
    alias: {
      '@': `${paths.src}/modules`
    },
    extensions: ['.wasm', '.ts', '.tsx', '.mjs', '.cjs', '.js', '.json']
  },
  experiments: {
    topLevelAwait: true,
    outputModule: true
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /\*\/node_modules/,
        use: babelLoader
      },
      {
        test: /\.(c|sa|sc)ss$/i,
        use: ['css-loader']
      },
      {
        test: /\.(jpe?g|png|gif|svg|eot|ttf|woff2?)$/i,
        type: 'asset'
      }
    ]
  }
};
