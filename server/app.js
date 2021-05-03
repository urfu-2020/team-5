// чужие импорты
const path = require('path');
const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const morgan = require('morgan');
const expressSession = require('express-session');
// наши импорты
const config = require('./config');
const passport = require('./passport/passportWithGithubStrategy');
const githubAuthRouter = require('./routes/githubAuthRouter');
const userRouter = require('./routes/userRouter');
const { configureSocket } = require('./socket/configureSocket');

const app = express();

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

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
} else {
  app.use(express.static(path.join(__dirname, '../client/public')));
}

const server = http.createServer(app);
configureSocket(server);

const { port } = config;
server.listen(port, () => {
  /* eslint no-console: "off" */
  console.info(`Server started on ${port}`);
});
