const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const WebpackBar = require('webpackbar');

module.exports = {
  mode: 'development',
  entry: './src/game.js',
  // devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'game.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new WebpackBar(),
    new ESLintPlugin({
      extensions: ['js', 'jsx']
    }),
    new webpack.ProvidePlugin({
      PIXI: 'pixi.js',
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        './src/game.json',
        './src/project.config.json',
        {
          from: './public/**/*',
          to({ absoluteFilename }) {
            return absoluteFilename.replace('/public', '/dist');
          },
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    // 设置别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};
