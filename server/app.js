// чужие импорты

const path = require('path');
const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const morgan = require('morgan');

// наши импорты
const config = require('./config');
const passport = require('./passport/passportWithGithubStrategy');
const githubAuthRouter = require('./routes/githubAuthRouter');
const userRouter = require('./routes/userRouter');
const chatRouter = require('./routes/chatRouter');
const session = require('./session');
const configureSocket = require('./socket/configureSocket');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session);

app.use(passport.initialize());
app.use(passport.session());

// роуты
app.use('/auth/github/', githubAuthRouter);
app.use('/user/', userRouter);
// потом у верхних тоже дописать /api в начале
app.use('/api/chat/', chatRouter);

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
