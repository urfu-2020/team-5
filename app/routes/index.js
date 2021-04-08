const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Killogramm', text: 'Hello, world!' });
});

module.exports = router;
