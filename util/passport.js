const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../models/user.model');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = process.env;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
  const googleId = profile.id;
    const existingUser = await User.findOne({
      where: { googleId }
    });

    if (existingUser) {
      return done(null, existingUser);
    }

    const email = profile.emails[0].value;
    let user = await User.findOne({
      where: { email }
    });

    if(user) {
      user.googleId = googleId;
    } else {
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.name.familyName + ' ' + profile.name.givenName
      });
    }
  await user.save();
  done(null, user);
  })
);


passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    profileFields: ['emails', 'displayName']
  }, async (accessToken, refreshToken, profile, done) => {
  console.log('vao FacebookStrategy');
    const facebookId = profile.id;
    console.log('facebookId', facebookId);
    const existingUser = await User.findOne({
      where: { facebookId }
    });
  console.log('existingUser', existingUser);

    if (existingUser) {
      return done(null, existingUser);
    }

    const email = profile.emails[0].value;
    let user = await User.findOne({
      where: { email }
    });

    if(user) {
      user.facebookId = facebookId;
    } else {
      user = new User({
        facebookId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName
      });
    }
    await user.save();
    done(null, user);
  })
);