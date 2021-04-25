const path = require(`path`);

module.exports = {
  webpack: {
    alias: {
      '@src': path.resolve(__dirname, 'src/'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@css': path.resolve(__dirname, 'src/css'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@reducers': path.resolve(__dirname, 'src/store/reducers')
    }
  },
};
