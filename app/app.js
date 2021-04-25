// чужие импорты
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const morgan = require('morgan');

// наши импорты
const config = require('./config');
const testApiRouter = require('./routes/test');

const app = express();
// мидлвары
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// роуты
app.use('/api/test', testApiRouter);

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
