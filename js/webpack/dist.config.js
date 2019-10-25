var path = require('path');
var version = require('../package.json').version;

module.exports = {
  // Embeddable ntnu-process-mining bundle
  //
  // This bundle is generally almost identical to the notebook bundle
  // containing the custom widget views and models.
  //
  // The only difference is in the configuration of the webpack public path
  // for the static assets.
  //
  // It will be automatically distributed by unpkg to work with the static
  // widget embedder.
  //
  // The target bundle is always `dist/index.js`, which is the path required
  // by the custom widget embedder.
  //
  entry: './src/index-embed.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '..', 'dist'),
    libraryTarget: 'amd',
    publicPath: 'https://unpkg.com/ntnu-process-mining@' + version + '/dist/'
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
  }
};
