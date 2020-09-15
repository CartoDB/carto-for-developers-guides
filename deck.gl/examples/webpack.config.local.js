const {resolve} = require('path');
const LUMA_LINK_ALIASES = {
  "@luma.gl/constants": resolve("../../../../deck.gl/node_modules/@luma.gl/constants"),
  "@luma.gl/core": resolve("../../../../deck.gl/node_modules/@luma.gl/core"),
  "@luma.gl/engine": resolve("../../../../deck.gl/node_modules/@luma.gl/engine"),
  "@luma.gl/webgl": resolve("../../../../deck.gl/node_modules/@luma.gl/webgl"),
  "@luma.gl/gltools": resolve("../../../../deck.gl/node_modules/@luma.gl/gltools"),
  "@luma.gl/shadertools": resolve("../../../../deck.gl/node_modules/@luma.gl/shadertools"),
  "@luma.gl/experimental": resolve("../../../../deck.gl/node_modules/@luma.gl/experimental"),
  "@loaders.gl/core": resolve("../../../../deck.gl/node_modules/@loaders.gl/core"),
  "@loaders.gl/images": resolve("../../../../deck.gl/node_modules/@loaders.gl/images"),
  "@deck.gl/carto": resolve("../../../../deck.gl/modules/carto")
}

module.exports = (config) => env => {
  if (!env) {
    return config;
  }

  config.resolve = config.resolve || {}

  config.resolve.alias = Object.assign({}, LUMA_LINK_ALIASES, config.resolve.alias || {});

  if (env && env.production) {
    config.mode = 'production';
  }

  return config;
};
