module.exports = {
  debug: false,
  port: process.env.PORT,
  staticBasePath: process.env.STATIC_DOMEN,
  cssBundle: `${process.env.STATIC_DOMEN}bundle.css`,
  jsBundle: `${process.env.STATIC_DOMEN}bundle.js`
};
