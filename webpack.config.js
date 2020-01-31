/* global __dirname */
module.exports = {
  entry: ['babel-polyfill', __dirname + '/scripts/src/index.js'],
  output: {
    path: __dirname + (process.env.NODE_ENV === 'development' ? '/_site' : '') + '/scripts/dist',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  externals: {
    jquery: 'jQuery'
  }
}
