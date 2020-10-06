// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {resolve} = require('path');

const CONFIG = (env) => {

  const config = {

    mode: 'development',

    entry: {
      app: "./src/app.js",
    },

    plugins: [
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        inject: true,
        template: resolve(__dirname, 'src/index.html'),
      })
    ]
  }
  
  if (env && env.production) {
    config.mode = 'production';
    config.output =  {
      // The build folder.
      path: resolve(__dirname, 'dist'),
      filename: 'js/[name].[contenthash:8].js',
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: 'js/[name].[contenthash:8].chunk.js'
    }
  }

  return config;

};

// This line enables bundling against src in this repo rather than installed module
module.exports = env => (env ? require('../../webpack.config.local')(CONFIG(env))(env) : CONFIG(env));
