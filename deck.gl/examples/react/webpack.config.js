// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const resolve = require("path").resolve;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const CONFIG = {
  mode: "development",

  entry: {
    app: resolve("./src/app.js"),
  },

  module: {
    rules: [
      {
        // Transpile ES6 to ES5 with babel
        // Remove if your app does not use JSX or you don't need to support old browsers
        test: /\.js$/,
        loader: "babel-loader",
        // exclude: [/node_modules/],
        options: {
          presets: ["@babel/preset-react"],
        },
      },
      // {
      //   // Unfortunately, webpack doesn't import library sourcemaps on its own...
      //   test: /\.js$/,
      //   use: ['source-map-loader'],
      //   enforce: 'pre'
      // },
      {
        // Compile source using babel. This is not necessary for src to run in the browser
        // However class inheritance cannot happen between transpiled/non-transpiled code
        // Which affects some examples
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env']
        },
        //include: [resolve(ROOT_DIR, 'modules'), resolve(ROOT_DIR, '../luma.gl/modules')]
      }
    ],

  },

  devtool: 'source-map',

  resolve: {
    alias: {
      // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
      "@deck.gl/carto": resolve("../../../../deck.gl/modules/carto"),
      "mapbox-gl$": resolve("./node_modules/mapbox-gl/dist/mapbox-gl.js")
    },
  },

  plugins: [new HtmlWebpackPlugin({ title: "deck.gl example" })],
};

module.exports = CONFIG;
