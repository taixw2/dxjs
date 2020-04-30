const config = require('@commitlint/config-conventional');
config.rules['type-enum'][2].push('release');
module.exports = config;
