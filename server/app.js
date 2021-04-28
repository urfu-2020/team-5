// чужие импорты
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const expressSession = require('express-session');
// наши импорты
const config = require('./config');
const passport = require('./passport/passportWithGithubStrategy');
const githubAuthRouter = require('./routes/githubAuthRouter');
const userRouter = require('./routes/userRouter');

const app = express();

const allowedOrigins = [process.env.CLIENT_URL, process.env.DATABASE_URL];
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true); if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not '
        + 'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    } return callback(null, true);
  },
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
app.use('/user/', userRouter);

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
