const express = require('express');
const passport = require('../passport/passportWithGithubStrategy');

const router = express.Router();

router.get('/login', passport.authenticate('github'));

router.get('/login/callback', passport.authenticate('github'),
  (req, res) => res.redirect(process.env.CLIENT_URL));

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
