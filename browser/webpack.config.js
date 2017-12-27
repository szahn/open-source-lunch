var webpack = require("webpack");
var path = require('path');

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.join(__dirname, 'wwwroot'),
    filename: 'app.min.js'
  },
  externals: {
      "react": "React",
      "react-dom": "ReactDOM",
    },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  watch: false,
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
  },
  plugins:[
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.ProvidePlugin({
      bluebird: 'bluebird'
    })
   ]
}