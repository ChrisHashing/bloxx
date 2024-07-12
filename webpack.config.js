const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      timers: require.resolve('timers-browserify'),
      fs: false, // or adjust based on your setup
      net: false, // or adjust based on your setup
      tls: false, // or adjust based on your setup
      buffer: require.resolve('buffer/'),
      process: require.resolve('process/browser'),
    },
  },
};