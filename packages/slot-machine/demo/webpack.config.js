const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  context: __dirname, // ensures all paths are relative to /demo
  entry: './index.tsx', // relative to /demo
  output: {
    path: path.resolve(__dirname, 'assets'), // => /demo/assets
    filename: 'bundle.js',
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, '../tsconfig.demo.json')
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        sideEffects: true
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle.css' // 👈 will be written to /demo/assets/bundle.css
    })
  ],
  devtool: 'source-map'
};
