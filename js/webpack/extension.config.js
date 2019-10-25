var path = require('path');

module.exports = {
  // Notebook extension
  //
  // This bundle only contains the part of the JavaScript that is run on
  // load of the notebook. This section generally only performs
  // some configuration for requirejs, and provides the legacy
  // "load_ipython_extension" function which is required for any notebook
  // extension.
  //
  entry: './src/extension.ts',
  output: {
    filename: 'extension.js',
    path: path.resolve(__dirname, '..', '..', 'ntnu_process_mining', 'static'),
    libraryTarget: 'amd'
  },
  module: {
    rules: [
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
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  }
};
