let config;

if (process.env.NODE_ENV === 'production') {
  config = {
    debug: false,
    port: process.env.PORT,
    staticBasePath: `https://${process.env.STATIC_DOMAIN}/`
  };
} else {
  config = {
    debug: true,
    port: 3001,
    clientPort: 3000,
    staticBasePath: '/'
  };
}

module.exports = config;
