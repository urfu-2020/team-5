const createError = require('http-errors');
const path = require('path');

const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const config = require('config');
const morgan = require('morgan');

const indexRouter = require('./routes/index');

const app = express();
const commonData = require('./middlewares/common-data');
const publicDir = path.join(__dirname, 'public');
const viewsDir = path.join(__dirname, 'views');

app.set('views', viewsDir);
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (config.get('debug')) {
  app.use(morgan('dev'));
}

if (process.env.NODE_ENV === 'development') {
  app.use(express.static(publicDir));
}

app.use('/', indexRouter);

app.use(commonData);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res) {
  res.status(err.status || 500);
});

const port = config.get('port');
app.listen(port, () => {
  /* eslint no-console: "off" */
  console.info(`Server started on ${port}`);
});
