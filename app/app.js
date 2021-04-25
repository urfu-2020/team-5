// чужие импорты
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const expressSession = require('express-session');
// наши импорты
const config = require('./config/config');
const passport = require('./passport/passportWithGithubStrategy');
const githubAuthRouter = require('./routes/githubAuthRouter');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// роуты
app.use('/auth/github/', githubAuthRouter);

if (config.debug) {
  app.use(morgan('dev'));
}

// в проде отдаем билд реакта, в дев отдаем исходники
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
} else {
  app.use(express.static(path.join(__dirname, '../client/public')));
}

const { port } = config;
app.listen(port, () => {
  /* eslint no-console: "off" */
  console.info(`Server started on ${port}`);
});
