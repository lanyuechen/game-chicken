const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/game.js',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'game.js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
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
          to({ context, absoluteFilename }) {
            return absoluteFilename.replace('/public', '/dist');
          },
        },
      ],
    }),
  ],
};
