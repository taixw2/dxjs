'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/common.production.min.js');
} else {
  module.exports = require('./cjs/common.development.js');
}
