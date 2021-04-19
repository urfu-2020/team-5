const config = require('config');

module.exports = (req, res, next) => {
  res.locals.meta = {
    charset: 'utf-8',
    description: 'Messager'
  };

  res.locals.staticBasePath = config.get('staticBasePath');
  res.locals.cssBundle = config.get('cssBundle');
  res.locals.jsBundle = config.get('jsBundle');

  next();
};
