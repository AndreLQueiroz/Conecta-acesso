const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Permite carregar o SQLite em WebAssembly.
if (!config.resolver.assetExts.includes('wasm')) {
  config.resolver.assetExts.push('wasm');
}

// Habilita SharedArrayBuffer no servidor de desenvolvimento.
const previousMiddleware = config.server.enhanceMiddleware;

config.server.enhanceMiddleware = (middleware, server) => {
  const enhancedMiddleware = previousMiddleware
    ? previousMiddleware(middleware, server)
    : middleware;

  return (req, res, next) => {
    res.setHeader(
      'Cross-Origin-Embedder-Policy',
      'credentialless'
    );

    res.setHeader(
      'Cross-Origin-Opener-Policy',
      'same-origin'
    );

    return enhancedMiddleware(req, res, next);
  };
};

module.exports = config;