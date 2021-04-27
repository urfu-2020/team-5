// чужие импорты
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const morgan = require('morgan');

const expressSession = require('express-session');
const passport = require('passport');
const passportGithub = require('passport-github');

const strategy = new passportGithub.Strategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/api/login/return'
  },
  (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  }
);

passport.use(strategy);

// наши импорты
const config = require('./config');
const testApiRouter = require('./routes/test');

const app = express();
// мидлвары
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(expressSession({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

passport.serializeUser((profile, done) => {
  done(null, profile);
});

passport.deserializeUser((profile, done) => {
  done(null, profile);
});

app.use(passport.initialize());
app.use(passport.session());

// роуты
app.use('/api/test', testApiRouter);

if (config.debug) {
  app.use(morgan('dev'));
}

app.get(
  '/api/login',
  passport.authenticate('github')
);
app.get(
  '/api/login/return',
  passport.authenticate(
    'github', { failureRedirect: `http://localhost:${config.clientPort}/` }
  ),
  (req, res) => {
    res.redirect(`http://localhost:${config.clientPort}/user`);
  }
);
app.get('/user', (req, res) => {
  res.json({ user: req.user });
});

// в проде отдаем билд реакта, в дев отдаем исходники
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
} else {
  app.get('*', (req, res) => {
    app.use(express.static(path.join(__dirname, 'client')));
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
  });
}

const { port } = config;
app.listen(port, () => {
  /* eslint no-console: "off" */
  console.info(`Server started on ${port}`);
});
