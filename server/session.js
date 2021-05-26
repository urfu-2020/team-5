const expressSession = require('express-session');

const session = expressSession({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});

module.exports = session;
