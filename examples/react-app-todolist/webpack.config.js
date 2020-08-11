const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: './src/index.tsx',

  output: {
    path: path.join(__dirname, './dist'),
    filename: 'main.js',
  },

  mode: 'development',

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  devServer: {
    host: 'localhost',
    port: 2020,
    hotOnly: true,
  },

  devtool: 'cheap-module-source-map',

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, './src'),
        loader: require.resolve('babel-loader'),
      },
      {
        test: /\.(ts|tsx)$/,
        loader: require.resolve('babel-loader'),
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'REACT APP TODOLIST',
    }),
    new webpack.DefinePlugin({
      __DEV__: 'true',
    }),
  ],
};
