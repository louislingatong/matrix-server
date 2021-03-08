const passport = require('passport');
const { ExtractJwt } = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const db = require('./models');
const { auth } = require('./config');

// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: auth.clientSecret
}, async (payload, done) => {
  try {
    // Find the user specified in token
    const user = await db.User.findById(payload.sub);

    // If user doesn't exists, handle it
    if (!user) { return done(null, false); }

    // Otherwise, return the user
    done(null, user);
  } catch (err) {
    done(err, false);
  }
}));

// LOCAL STRATEGY
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    // Find the user specified in token
    const user = await db.User.findOne({ username });

    // If user doesn't exists, handle it
    if (!user) { return done(null, false); }

    // Check if the password is valid
    const isValid = await user.validatePassword(password);

    // If invalid password, handle it
    if (!isValid) { return done(null, false); }

    // Otherwise, return the user
    done(null, user);
  } catch (err) {
    done(err, false);
  }
}));
