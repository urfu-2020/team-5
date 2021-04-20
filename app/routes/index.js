const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Killogramm', text: 'Hello, world!', ...res.locals });
});

module.exports = router;
