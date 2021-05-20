const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const { createUser, getUser } = require('../db/dbapi');

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/auth/github/login/callback`
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    const { username, profileUrl } = profile;
    const avatarUrl = profile._json.avatar_url;
    let user = await getUser('username', username);
    if (!user) {
      await createUser(username, avatarUrl, profileUrl);
      user = await getUser('username', username);
    }
    return cb(null, user);
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
