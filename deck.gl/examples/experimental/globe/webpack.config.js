// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file
const HtmlWebpackPlugin = require('html-webpack-plugin');

const CONFIG = (env) => {

  const config = {

    mode: 'development',

    entry: {
      app: "./app.js",
    },

    plugins: [
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: '/Users/alasarr/dev/viz-doc/deck.gl/examples/experimental/globe/index.html',
          }
        )
      ),
    
    ].filter(Boolean)
  }
  
  if (env && env.production) {
    config.mode = 'production';
    config.output =  {
      // The build folder.
      path: '/Users/alasarr/dev/viz-doc/deck.gl/examples/experimental/globe/dist',
      filename: 'js/[name].[contenthash:8].js',
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: 'js/[name].[contenthash:8].chunk.js'
    }
  }

  return config;

};

// This line enables bundling against src in this repo rather than installed module
module.exports = env => (env ? require('../../webpack.config.local')(CONFIG(env))(env) : CONFIG(env));
