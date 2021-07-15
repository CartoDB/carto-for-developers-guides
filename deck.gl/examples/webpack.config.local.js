const {resolve} = require('path');

const ROOT_DIR = resolve(__dirname, '../..');

const LUMA_LINK_ALIASES = {
  "@luma.gl/constants": resolve(`${ROOT_DIR}/../deck.gl/node_modules/@luma.gl/constants`),
  "@luma.gl/core": resolve(`${ROOT_DIR}/../deck.gl/node_modules/@luma.gl/core`),
  "@luma.gl/engine": resolve(`${ROOT_DIR}/../deck.gl/node_modules/@luma.gl/engine`),
  "@luma.gl/webgl": resolve(`${ROOT_DIR}/../deck.gl/node_modules/@luma.gl/webgl`),
  "@luma.gl/gltools": resolve(`${ROOT_DIR}/../deck.gl/node_modules/@luma.gl/gltools`),
  "@luma.gl/shadertools": resolve(`${ROOT_DIR}/../deck.gl/node_modules/@luma.gl/shadertools`),
  "@luma.gl/experimental": resolve(`${ROOT_DIR}/../deck.gl/node_modules/@luma.gl/experimental`),
  "@loaders.gl/core": resolve(`${ROOT_DIR}/../deck.gl/node_modules/@loaders.gl/core`),
  "@loaders.gl/images": resolve(`${ROOT_DIR}/../deck.gl/node_modules/@loaders.gl/images`),
  "@deck.gl/carto": resolve(`${ROOT_DIR}/../deck.gl/modules/carto`)
}

module.exports = (config) => env => {
  if (!env) {
    return config;
  }

  config.resolve = config.resolve || {}

  if (env && env.local) {
    config.resolve.alias = Object.assign({}, LUMA_LINK_ALIASES, config.resolve.alias || {});
  }

  if (env && env.production) {
    config.mode = 'production';
  }

  return config;
};
