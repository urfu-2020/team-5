const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
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
  output: {
    path: paths.build,
    filename: 'bundle.js',
    publicPath: paths.public,
    clean: true,
    crossOriginLoading: 'anonymous',
    module: true,
    environment: {
      arrowFunction: true,
      bigIntLiteral: false,
      const: true,
      destructuring: true,
      dynamicImport: false,
      forOf: true
    }
  },
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
      // JavaScript
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: babelLoader
      },
      // CSS, SASS
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      // static files
      {
        test: /\.(jpe?g|png|gif|svg|eot|ttf|woff2?)$/i,
        type: 'asset'
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),

    new MiniCssExtractPlugin({
      filename: 'bundle.css'
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${paths.public}`
        }
      ]
    }),
    new CleanWebpackPlugin()
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new UglifyJsPlugin()
    ]
  }
};
