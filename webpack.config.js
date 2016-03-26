/* global __dirname */
module.exports = {
  entry: __dirname + '/scripts/src/index.js',
  output: {
    path: __dirname + '/_site/scripts/dist',
    publicPath: '/_site/scripts/dist/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  externals: {
    jquery: 'jQuery'
  }
}
