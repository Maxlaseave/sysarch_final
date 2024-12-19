const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');

// Replace these values with your OAuth2 provider's details
const OAUTH2_CLIENT_ID = process.env.OAUTH2_CLIENT_ID || 'your-client-id';
const OAUTH2_CLIENT_SECRET = process.env.OAUTH2_CLIENT_SECRET || 'your-client-secret';
const OAUTH2_CALLBACK_URL = process.env.OAUTH2_CALLBACK_URL || 'http://localhost:3000/auth/oauth2/callback';

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: 'https://your-oauth2-provider.com/auth',
      tokenURL: 'https://your-oauth2-provider.com/token',
      clientID: OAUTH2_CLIENT_ID,
      clientSecret: OAUTH2_CLIENT_SECRET,
      callbackURL: OAUTH2_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, cb) => {
      // Here you can find or create a user in your database
      const user = { accessToken, profile };
      return cb(null, user);
    }
  )
);

// Serialize and deserialize user for session handling
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = passport;
 