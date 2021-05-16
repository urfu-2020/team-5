const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

const dbapi = require('../db/dbapi');

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/auth/github/login/callback`
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    const jsonUser = profile._json;
    const user = await dbapi.getUserByName(jsonUser.login);
    if (!user) {
      await dbapi.createUser(jsonUser.login, jsonUser.avatar_url, jsonUser.html_url);
      await dbapi.addDialogsWithNewUser(jsonUser.login);
    }
    return cb(null, profile);
  } catch (e) {
    return cb(e, null);
  }
}));

passport.serializeUser((profile, done) => {
  done(null, profile);
});

passport.deserializeUser((profile, done) => {
  done(null, profile);
});

module.exports = passport;
