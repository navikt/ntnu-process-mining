var path = require('path');

module.exports = {
  // Bundle for the notebook containing the custom widget views and models
  //
  // This bundle contains the implementation for the custom widget views and
  // custom widget.
  // It must be an amd module
  //
  entry: './src/index-classic.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '..', '..', 'ntnu_process_mining', 'static'),
    libraryTarget: 'amd',
    publicPath: 'http://localhost:8080/'
  },
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules\/(?!(@data-ui)\/).*/,
        use: [
          {
          loader: "@babel/loader",
          options: {
            presets: ['@babel/react']
          }
          }
        ],
      }
    ]
  },
  externals: ['@jupyter-widgets/base'],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  devServer: {
    contentBase: path.resolve(
      __dirname,
      '..',
      '..',
      'ntnu_process_mining',
      'static'
    ),
    publicPath: '/',
    hot: true,
    compress: true,
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization'
    }
  }
};
