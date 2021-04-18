const path = require('path');

module.exports = {
  public: path.resolve(__dirname, '../../front/public'),
  src: path.resolve(__dirname, '../../front'),
  build: path.resolve(__dirname, '../../app/public')
};
