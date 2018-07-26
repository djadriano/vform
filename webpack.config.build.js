const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/vform.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'vform.min.js',
    libraryTarget: 'umd',
    library: 'VForm',
    umdNamedDefine: true,
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      }
    ]
  }
};
