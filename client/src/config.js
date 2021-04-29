export let config;

if (process.env.NODE_ENV === 'production') {
  config = {
    staticBasePath: `https://${process.env.REACT_APP_STATIC_DOMAIN}/`
  };
} else {
  config = {
    staticBasePath: '/',
    serverPort: 3001
  };
}
