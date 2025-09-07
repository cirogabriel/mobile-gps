const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuración para Firebase y ES modules
config.resolver.sourceExts.push('cjs');

module.exports = config;
