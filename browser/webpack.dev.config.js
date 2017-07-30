var path = require('path');

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.join(__dirname, 'wwwroot'),
    filename: 'app.js'
  },
  externals: {
      "react": "React",
      "react-dom": "ReactDOM",
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  watch: true,
  devtool: "source-map",
  module: {
    loaders: [
      {
        test: /\.js?x$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
}