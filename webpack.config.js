const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: __dirname + '/build/',
    filename: 'index.js',
  },
  resolve: {
    extensions: ['*', '.jsx', '.js'],
    alias: {
      '@': __dirname + '/src/',
      '%': __dirname + '/hooks/',
    }
  },
  module: {
    rules: [
      { test: /.(js|jsx)$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test: /.(jpg|png|svg|mp4|avi)$/, use: ['file-loader'] },
      { test: /.(c|sc|sa)ss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /.html$/, use: ['html-loader'] },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    })
  ]
}